import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
// import { functions } from '@mussia12/shared/pulumi-gcp';
const config = new pulumi.Config();
// import { storage } from './src';

// const project = config.get('project') || 'mussia8';
const location = config.get('location') || 'europe-west1';
// Create a GCP resource (Storage Bucket)
// const buckets = storage(location);
const tempFolder = new gcp.storage.Bucket('temp-folder', {
  location,
  forceDestroy: true,
});
// Export the DNS name of the bucket
export const bucketName = tempFolder;
