import * as gcp from '@pulumi/gcp';
import { GcpFunction } from '../types';
import * as pulumi from '@pulumi/pulumi';
import { Bucket } from '@pulumi/gcp/storage';
import { camelCase } from 'lodash';

const gcpFunction = (props: {
  name: string;
  region: string;
  bucket: Bucket;
}) => {
  const { name, region, bucket } = props;
  const archive = new gcp.storage.BucketObject(name, {
    name: `${name}.zip`,
    bucket: bucket.name,
    source: new pulumi.asset.FileArchive(`../../../dist/apps/big-data/${name}`),
  });

  return new gcp.cloudfunctions.Function(name, {
    runtime: 'nodejs16',
    availableMemoryMb: 256,
    sourceArchiveBucket: bucket.name,
    sourceArchiveObject: archive.name,
    triggerHttp: true,
    entryPoint: camelCase(name),
    name: name,
    region,
  }).httpsTriggerUrl;
};

export const createGcpFunctions = (list: GcpFunction[]) =>
  list.map(gcpFunction);
