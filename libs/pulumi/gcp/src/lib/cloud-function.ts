import { camelCase } from 'lodash';
import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
// import {  } from '@pulumi/gcp/cloudfunctions';
// import { GcpFunction } from '@mussia12/pulumi/shared-types'; // todo fix
import { Bucket } from '@pulumi/gcp/storage';

export type GcpFunction = {
  name: string;
  region: string;
  path: string;
  bucket: Bucket;
  members: [string];
};

const gcpFunction = (props: GcpFunction) => {
  const { name, region, bucket, path } = props;
  const archive = new gcp.storage.BucketObject(name, {
    name: `${name}.zip`,
    bucket: bucket.name,
    source: new pulumi.asset.FileArchive(`${path}${name}`),
  });

  const _function = new gcp.cloudfunctions.Function(name, {
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

  const invoker = new gcp.cloudfunctions.FunctionIamMember('invoker', {
    project: _function.project,
    region: _function.region,
    cloudFunction: _function.name,
    role: 'roles/cloudfunctions.invoker',
    member: 'allUsers',
  });
};

export const createGcpFunctions = (list: GcpFunction[]) =>
  list.map(gcpFunction);
