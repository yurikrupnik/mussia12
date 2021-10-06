export function pulumiSharedLibs(): string {
  return 'pulumi-shared-libs';
}

export function generateAvro(fields: Avro[]) {
  return `
    {
      "type": "record",
      "name": "Avro",
      "fields": ${JSON.stringify(fields)}
    }
  `;
}

export type Avro = {
  name: string;
  description: string;
  type:
    | 'null'
    | 'boolean'
    | 'int'
    | 'long'
    | 'float'
    | 'double'
    | 'bytes'
    | 'string';
};

export type BigquerySchema = {
  name: string;
  mode: 'REQUIRED' | 'NULLABLE' | 'REPEATED';
  type: BigquerySchemaTypes;
  description: string;
};

export type BigquerySchemaTypes =
  | 'STRING'
  | 'BYTES'
  | 'INTEGER'
  | 'FLOAT'
  | 'NUMERIC'
  | 'BIGNUMBER'
  | 'BOOLEAN'
  | 'TIMESTAMP'
  | 'DATE'
  | 'DATETIME'
  | 'GEOGRAPHY'
  | 'RECORD';
import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import camelCase from 'lodash/camelCase';
import { Bucket } from '@pulumi/gcp/storage';
import { FunctionArgs } from '@pulumi/gcp/cloudfunctions';

export interface GcpFunction {
  name: string;
  region: string;
  path: string;
  bucket: Bucket;
  member?: string;
  eventTrigger?: {
    // todo check using FunctionArgs['eventTrigger'] for loop
    failurePolicy?: {
      retry: boolean;
    };
    eventType: string;
    resource: string;
  };
  environmentVariables?: FunctionArgs['environmentVariables'];
}

const gcpFunction = (props: GcpFunction) => {
  const {
    name,
    region,
    bucket,
    path,
    member,
    eventTrigger,
    environmentVariables,
  } = props;
  const archive = new gcp.storage.BucketObject(name, {
    name: `${name}.zip`,
    bucket: bucket.name,
    source: new pulumi.asset.FileArchive(`${path}${name}`),
  });

  const func = new gcp.cloudfunctions.Function(name, {
    runtime: 'nodejs16',
    availableMemoryMb: 256,
    sourceArchiveBucket: bucket.name,
    sourceArchiveObject: archive.name,
    triggerHttp: eventTrigger ? null : true,
    eventTrigger: eventTrigger ? eventTrigger : null,
    entryPoint: camelCase(name),
    name: name,
    region,
    environmentVariables,
    // serviceAccountEmail: '',
  });

  let invoker;
  if (member) {
    invoker = new gcp.cloudfunctions.FunctionIamMember(`${name}-invoker`, {
      project: func.project,
      region: func.region,
      cloudFunction: func.name,
      role: 'roles/cloudfunctions.invoker',
      member,
    });
  }

  return {
    url: func.httpsTriggerUrl,
    invoker,
  };
};

export const createGcpFunctions = (list: GcpFunction[]) =>
  list.map(gcpFunction);
