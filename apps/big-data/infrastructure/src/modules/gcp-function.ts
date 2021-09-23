import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import camelCase from 'lodash/camelCase';
import { GcpFunction } from '../types';

const gcpFunction = (props: GcpFunction) => {
  const { name, region, bucket, path, member } = props;
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
    triggerHttp: true,
    // eventTrigger: {eventType: ""}
    entryPoint: camelCase(name),
    name: name,
    region,
  });
  const invoker = new gcp.cloudfunctions.FunctionIamMember(`${name}-invoker`, {
    project: func.project,
    region: func.region,
    cloudFunction: func.name,
    role: 'roles/cloudfunctions.invoker',
    member,
  });

  return {
    url: func.httpsTriggerUrl,
    invoker,
  };
};

export const createGcpFunctions = (list: GcpFunction[]) =>
  list.map(gcpFunction);
