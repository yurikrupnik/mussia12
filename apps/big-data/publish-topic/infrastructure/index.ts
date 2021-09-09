import * as path from 'path';
import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';

const stackConfig = new pulumi.Config();
const config = {
  // ===== DONT'T TOUCH THIS -> CONFIG REQUIRED BY nx-deploy-it ======
  projectName: stackConfig.get('projectName'),
  // ===== END ======
};
const projectName = config.projectName;

const bucket = new gcp.storage.Bucket(`${projectName}_bucket`);
const bucketObjectGo = new gcp.storage.BucketObject('zip-archive', {
  bucket: bucket.name,
  source: new pulumi.asset.AssetArchive({
    '.': new pulumi.asset.FileArchive(
      path.join(__dirname, 'dist/apps/big-data/publish-topic')
    ),
    'users-api-testing': new pulumi.asset.FileArchive(
      'dist/apps/fullstack/be/users-api'
    ),
  }),
});

const cloudFunction = new gcp.cloudfunctions.Function(`${projectName}-func`, {
  sourceArchiveBucket: bucket.name,
  runtime: 'nodejs16',
  sourceArchiveObject: bucketObjectGo.name,
  entryPoint: 'handler',
  triggerHttp: true,
  availableMemoryMb: 128,
});

const permission = new gcp.cloudfunctions.FunctionIamMember(
  `${projectName}-func-role`,
  {
    cloudFunction: cloudFunction.name,
    role: 'roles/cloudfunctions.invoker',
    member: 'allUsers',
  }
);

export const nodeEndpoint = cloudFunction.httpsTriggerUrl;

// const runtime = 'nodejs14';
// const name = 'func1';
// const location = 'europe-west1';
//
// const bucket = new gcp.storage.Bucket('data-pipelines-functions', {
//   forceDestroy: true,
//   location,
// });
// // Create a GCP resource (Storage Bucket)
// const archive = new gcp.storage.BucketObject(name, {
//   name: `${name}.zip`,
//   bucket: bucket.name,
//   source: new pulumi.asset.FileArchive(`../../../dist/apps/${name}`),
// });
//
// // Create a GCP function
// new gcp.cloudfunctions.Function(name, {
//   runtime,
//   availableMemoryMb: 256,
//   sourceArchiveBucket: bucket.name,
//   sourceArchiveObject: archive.name,
//   triggerHttp: true,
//   entryPoint: name,
//   name,
//   region: location,
// }).httpsTriggerUrl;
