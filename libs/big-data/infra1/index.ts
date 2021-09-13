import * as pulumi from '@pulumi/pulumi';
import * as path from 'path';
// import { Input } from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';
import { camelCase } from 'lodash';
import { BucketArgsSelf, GcpFunction, Avro } from './src/types';
import { generateAvro } from './src/utils/createAvroSchema';
import { storage } from './src/modules/bucket';
import { createGcpFunctions } from './src/modules/gcp-function';
// import { Bucket } from '@pulumi/gcp/storage';

import { event1, event2 } from './src/schemas';
import * as fs from 'fs';
import { pubsub } from '@pulumi/gcp';

const config = new pulumi.Config();

const location = config.get('location') || 'europe-west1';
const project = config.get('project') || 'mussia8';

const bucketList: BucketArgsSelf[] = [
  {
    name: `${project}-temp-folder`,
    location,
  },
  {
    name: 'big-data-functions',
    location,
    versioning: {
      enabled: true,
    },
  },
  {
    name: 'be-events',
    location,
  },
  {
    name: 'agents-events',
    location,
  },
  {
    name: 'core-events',
    location,
  },
  {
    name: 'fe-events',
    location,
  },
];

const storages = storage(bucketList);
//
// const functions: GcpFunction[] = [
//   {
//     name: 'publish-topic',
//     region: location,
//     bucket: storages[1],
//   },
// ];

// const funcs = createGcpFunctions(functions);

type EventsEnum = 'event1' | 'event2' | 'event3';

type Event = {
  name: EventsEnum;
  schema: Avro[];
  definition: string;
};

const events: Event[] = [
  {
    name: 'event1',
    schema: event1,
    definition: generateAvro(event1),
  },
  {
    name: 'event2',
    schema: event2,
    definition: generateAvro(event2),
  },
];

// events.map((event) => {
//   const { name } = event;
//   const schema = new gcp.pubsub.Schema(name, {
//     name,
//     type: 'AVRO',
//     definition: event.definition,
//   });
//
//   const topic = new gcp.pubsub.Topic(name, {
//     name,
//     schemaSettings: {
//       schema: schema.id,
//       encoding: 'JSON',
//     },
//   });
//
//   const pubsubStream = new gcp.dataflow.Job(`${name}-ps-to-gcs-text`, {
//     region: location,
//     name: `${name}-ps-to-gcs-text`,
//     templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text',
//     tempGcsLocation: pulumi.interpolate`${storages[0].url}/temp`,
//     parameters: {
//       inputTopic: topic.id,
//       outputDirectory: pulumi.interpolate`${storages[2].url}/text/${name}`,
//       outputFilenamePrefix: `${name}-ps-to-text-be-logs`,
//     },
//     onDelete: 'cancel',
//   });
//
//   const pubsubStream2 = new gcp.dataflow.Job(`${name}-ps-to-avro`, {
//     region: location,
//     name: `${name}-ps-to-avro`,
//     templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_Avro',
//     tempGcsLocation: pulumi.interpolate`${storages[0].url}/temp`,
//     parameters: {
//       inputTopic: topic.id,
//       outputDirectory: pulumi.interpolate`${storages[2].url}/avro/${name}`,
//       avroTempDirectory: pulumi.interpolate`${storages[0].url}/temp/${name}`,
//     },
//     onDelete: 'cancel',
//   });
//
//   const bigquery_streaml = new gcp.dataflow.Job(`${name}-ps-to-bq`, {
//     templateGcsPath:
//       'gs://dataflow-templates-europe-north1/latest/PubSub_to_BigQuery',
//     tempGcsLocation: pulumi.interpolate`${storages[0].url}/temp`,
//     parameters: {
//       inputTopic: topic.id,
//       outputTableSpec: 'mussia8:example_dataset.bar',
//     },
//     onDelete: 'cancel',
//   });
// });

// });
// Export the DNS name of the bucket
// export const bucketName = tempFolder.url;
// export const schemas = schema;

// todo service
const services = ['bi-service'];

services.map((service) => {
  const myImage = new docker.Image(service, {
    imageName: pulumi.interpolate`eu.gcr.io/${gcp.config.project}/${service}:latest`,
    build: {
      // args: {
      //   PORT: '3333',
      // },
      context: `../../../apps/big-data/${service}`,
      env: {
        PORT: '3333',
      },
    },
  });
  console.log('myImage', myImage);
  const serv = new gcp.cloudrun.Service(
    service,
    {
      location,
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
    location,
    role: 'roles/run.invoker',
    member: 'allUsers',
  });
});
