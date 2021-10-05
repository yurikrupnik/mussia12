import { BucketArgs } from '@pulumi/gcp/storage/bucket';
import { Bucket } from '@pulumi/gcp/storage';
import { FunctionArgs } from '@pulumi/gcp/cloudfunctions';

export type BucketArgsSelf = BucketArgs & {
  name: string;
};

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
