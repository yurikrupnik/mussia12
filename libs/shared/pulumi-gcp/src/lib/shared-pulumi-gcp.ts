import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';
import * as gcp from '@pulumi/gcp';

const functionsStrings = ['func1', 'func2'];

const rawBucket = new gcp.storage.Bucket('big-data-raw', {
  forceDestroy: true,
  location: 'europe-west1',
});

const tempBucket = new gcp.storage.Bucket('temp-util', {
  forceDestroy: true,
  location: 'europe-west1',
});

const bucket = new gcp.storage.Bucket('data-pipelines-functions', {
  forceDestroy: true,
  location: 'europe-west1',
});

const functionsArray = functionsStrings.map((name) => {
  const archive = new gcp.storage.BucketObject(name, {
    name: `${name}.zip`,
    bucket: bucket.name,
    source: new pulumi.asset.FileArchive(`../dist/apps/${name}`),
  });
  return new gcp.cloudfunctions.Function(name, {
    runtime: 'nodejs14',
    availableMemoryMb: 256,
    sourceArchiveBucket: bucket.name,
    sourceArchiveObject: archive.name,
    triggerHttp: true,
    entryPoint: name,
    name: name,
    region: 'europe-west1',
  }).httpsTriggerUrl;
});

const services = ['batman-api'];

services.map((service) => {
  const myImage = new docker.Image(service, {
    imageName: pulumi.interpolate`eu.gcr.io/${gcp.config.project}/${service}:latest`,
    build: {
      context: `../apps/${service}`,
    },
  });
  const serv = new gcp.cloudrun.Service(
    service,
    {
      location: 'europe-west1',
      name: service,
      template: {
        spec: {
          containers: [
            {
              image: myImage.imageName,
            },
          ],
        },
      },
    },
    { dependsOn: myImage }
  );
  return new gcp.cloudrun.IamMember('hello-everyone', {
    service: serv.name,
    location: 'europe-west1',
    role: 'roles/run.invoker',
    member: 'allUsers',
  });
});

const schema = new gcp.pubsub.Schema('event1', {
  name: 'event1',
  type: 'AVRO',
  definition: `
    {
  "type" : "record",
  "name" : "Avro",
  "fields" : [
    {
      "name" : "stringField",
      "type" : "string",
      "description": "Testing string field"
    },
    {
      "name" : "intField",
      "type" : "int",
      "description": "Testing int field"
    },
    {
      "name" : "tenantId",
      "type" : "string",
      "description": "Tenant Id"
    }
  ]
}
  `,
  // definition: new pulumi.asset.FileAsset('./events-schemas/events-schema.json').toString()
  // definition: JSON.stringify(new pulumi.asset.FileAsset('./events-schemas/events-schema.json'))
  // definition: new pulumi.asset.FileArchive('./events-schemas/events-schema.json')
});

// const topic = new gcp.pubsub.Topic('event1', {
//   name: 'event1',
//   schemaSettings: {
//     schema: schema.id,
//     encoding: 'JSON',
//   },
// });

// topic.onMessagePublished('ads', {})

// bucket.onObjectArchived('yes', {
//
// })

const deadLetter = new gcp.pubsub.Topic('dead-letter', {
  name: 'dead-letter',
  // schemaSettings: {
  //   schema: schema.id,
  //   encoding: 'JSON'
  // }
});

// const pubsubStream = new gcp.dataflow.Job("pubsubStream", {
//   templateGcsPath: "gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text",
//   tempGcsLocation: `${tempBucket.url}/temp`,
//   parameters: {
//     inputTopic: topic.id,
//     outputDirectory: `${rawBucket.name}/text`,
//     outputFilenamePrefix: "ps-to-text-be-logs",
//   },
//   onDelete: "cancel",
// });

// export const image = nodeService
export const dic = rawBucket;

export const functions = functionsArray;
