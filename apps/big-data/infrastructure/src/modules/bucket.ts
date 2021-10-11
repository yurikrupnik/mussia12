import * as gcp from '@pulumi/gcp';
import { BucketArgsSelf, GcpFunction } from '../types';
import * as pulumi from '@pulumi/pulumi';
import { FunctionArgs } from '@pulumi/gcp/cloudfunctions';
import { Bucket } from '@pulumi/gcp/storage';
import { camelCase } from 'lodash';

export interface GcpBucket {
  name?: string,
  project: string,
  region: string,
  // labels: Bucket['labels']
}

export class GcpBucketResource extends pulumi.ComponentResource {

  public bucket: Bucket
  // public bucket:
  constructor(name: GcpBucket['name'], gcpStorage: GcpBucket,  opts?: pulumi.ResourceOptions ) {
    super('mussia8:utils:storage:', name, {}, opts);
    const {region, project} = gcpStorage
    this.bucket  = new gcp.storage.Bucket(name, {
      name,
      location: region,
      forceDestroy: true,
      labels: {
        type: 'temp',
        team: 'util',
      },
    }, {parent: this});
  }
}
