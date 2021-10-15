import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { readdirSync, statSync } from 'fs';
import * as mime from 'mime';
import * as path from 'path';
import { basename } from 'path';
import { interpolate } from '@pulumi/pulumi';

const stackConfig = new pulumi.Config();

const config = {
  // ===== DONT'T TOUCH THIS -> CONFIG REQUIRED BY nx-deploy-it ======
  // projectName: stackConfig.get('projectName'),
  projectName: 'mussia8',
  // distPath: path.join(__dirname, '../../../', 'dist/fullstack/client'),
  distPath: path.join(__dirname, '../../../../dist/apps/fullstack/client-next'),
  useCdn: true,
  customDomainName: 'www.krupnikyuri.com',
  // ===== END ======
};

const contentBucket = new gcp.storage.Bucket('contentBucket', {
  name: `${config.projectName}-static-site`,
  website: {
    mainPageSuffix: 'exported/index.html',
    notFoundPage: 'exported/404.html',
  },
  project: config.projectName,
  forceDestroy: true,
  versioning: {
    enabled: true,
  },
});

const oacResource = new gcp.storage.DefaultObjectAccessControl(
  `${config.projectName}-storage-oac`,
  {
    bucket: contentBucket.name,
    entity: 'allUsers',
    role: 'READER',
  }
);

// const archive = new gcp.storage.BucketObject(
//   name,
//   {
//     name: `${name}.zip`,
//     bucket: contentBucket.name,
//     source: new pulumi.asset.F(`${path}${name}`),
//   },
//   { parent: this }
// );

const files = readdirSync(config.distPath);
// crawlDirectory recursive crawls the provided directory, applying the provided function
// to every file it contains. Doesn't handle cycles from symlinks.
function crawlDirectory(dir: string, f: (_: string) => void) {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      crawlDirectory(filePath, f);
    }
    if (stat.isFile()) {
      f(filePath);
    }
  }
}

// // Sync the contents of the source directory with the GCP bucket.
crawlDirectory(config.distPath, (filePath: string) => {
  const relativeFilePath = filePath.replace(config.distPath + '/', '');
  const file = new gcp.storage.BucketObject(
    relativeFilePath,
    {
      bucket: contentBucket.name,
      source: new pulumi.asset.FileAsset(filePath),
      name: basename(relativeFilePath),
      // contentType: mime.getType(filePath) || undefined
    },
    { dependsOn: oacResource }
  );
});

if (config.useCdn) {
  const cdnEndpointResource = new gcp.compute.BackendBucket(
    `${config.projectName}-cbb`,
    {
      bucketName: contentBucket.name,
      enableCdn: true,
      project: config.projectName,
    }
  );
}

export const endpoint = interpolate`https://${config.customDomainName}`;
