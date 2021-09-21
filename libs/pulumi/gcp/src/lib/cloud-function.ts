import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

const runtime = 'nodejs14';
const name = 'func1';
const location = 'europe-west1';

const bucket = new gcp.storage.Bucket('data-pipelines-functions', {
  forceDestroy: true,
  location,
});
// Create a GCP resource (Storage Bucket)
const archive = new gcp.storage.BucketObject(name, {
  name: `${name}.zip`,
  bucket: bucket.name,
  source: new pulumi.asset.FileArchive(`../../../dist/apps/${name}`),
});

// Create a GCP function
new gcp.cloudfunctions.Function(name, {
  runtime,
  availableMemoryMb: 256,
  sourceArchiveBucket: bucket.name,
  sourceArchiveObject: archive.name,
  triggerHttp: true,
  entryPoint: name,
  name,
  region: location,
}).httpsTriggerUrl;
