import * as pulumi from '@pulumi/pulumi';
import * as path from 'path';
// import { Input } from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
// import {SchemaState} from '@pulumi/gcp/pubsub/schema';
import * as docker from '@pulumi/docker';
import { camelCase } from 'lodash';
import { BucketArgsSelf, GcpFunction, Avro } from './src/types';
import { generateAvro } from './src/utils/createAvroSchema';
// import { storage } from './src/modules/bucket';
import { createGcpFunctions } from './src/modules/gcp-function';
// import { Bucket } from '@pulumi/gcp/storage';

import { event1, event2 } from './src/schemas';
import * as fs from 'fs';
import { pubsub } from '@pulumi/gcp';
import { ResourceOptions } from '@pulumi/pulumi';

const config = new pulumi.Config();

const region = config.get('region') || 'europe-west1';
const project = config.get('project') || 'mussia8';
const functionsPath = '../../../dist/apps/big-data/';

const bucketList: BucketArgsSelf[] = [
  {
    name: `${project}-temp-folder`,
    location: region,
  },
  {
    name: 'big-data-functions',
    location: region,
    versioning: {
      enabled: true,
    },
  },
  {
    name: 'be-events',
    location: region,
  },
  {
    name: 'agents-events',
    location: region,
  },
  {
    name: 'core-events',
    location: region,
  },
  {
    name: 'fe-events',
    location: region,
  },
];

// const storages = storage(bucketList);
// //

const funcBucket = new gcp.storage.Bucket(`${project}-func-bucket`, {
  name: `${project}-func-bucket`,
  location: region,
  forceDestroy: true,
  labels: {
    type: 'code',
    team: 'big-data',
  },
});

const functions: GcpFunction[] = [
  {
    name: 'publish-topic',
    region,
    bucket: funcBucket,
    path: functionsPath,
  },
];
// ../../../dist/apps/big-data/

const funcs = createGcpFunctions(functions);
//
// type EventsEnum = 'event1' | 'event2' | 'event3';
//
// type Event = {
//   name: EventsEnum;
//   schema: Avro[];
// };
//
//
const dataset = new gcp.bigquery.Dataset('big-data-dataset', {
  datasetId: `${project}_big_data_dataset`,
  description: 'This is a test description',
  friendlyName: 'Test logs',
  location: region,
  defaultTableExpirationMs: 3600000,
  labels: {
    env: 'default',
    name: 'aris-test',
  },
});

const bigquerySchema = [
  {
    name: 'stringField',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'Testing string field',
  },
  {
    name: 'intField',
    type: 'INTEGER',
    mode: 'NULLABLE',
    description: 'Testing int field',
  },
  {
    name: 'tenantId',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'Tenant Id',
  },
  {
    name: 'tenantId1',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'Tenant Id1',
  },
];

// const table = new gcp.bigquery.Table('my-table', {
//   datasetId: dataset.datasetId,
//   tableId: 'my-table',
//   description: 'my table for agent logs',
//   deletionProtection: false,
//   timePartitioning: {
//     type: 'DAY',
//   },
// });
//
// const beLogsTable = new gcp.bigquery.Table('beLogsTable', {
//   datasetId: dataset.datasetId,
//   tableId: 'beLogsTable',
//   deletionProtection: false,
//   timePartitioning: {
//     type: 'MONTH',
//   },
//   labels: {
//     env: 'default',
//   },
//   schema: JSON.stringify(bigquerySchema),
// });

// gcp.storage.getBucketObject()
const directoryPath = path.join(__dirname, 'src/schemas/be');

// file way
// Generate all schemas for PubSub
// async function handleSchemas() {
//   return fs.promises
//     .readdir(directoryPath)
//     .then((schemas) => {
//       console.log('schemasss', schemas);
//       return schemas.map((schema) => {
//         return new pubsub.Schema(schema, {
//           name: schema.split('.')[0],
//           type: 'AVRO',
//           definition: `events-schemas/${schema}`, // todo read content and pass as string, see what generateAvro does
//         });
//       });
//     })
//     .catch((err) => {
//       console.log('Failed to read events-schemas folder');
//     });
// }
//
// handleSchemas();
import { Subscription, TopicArgs } from '@pulumi/gcp/pubsub';
import { JobArgs } from '@pulumi/gcp/dataflow';
import { BucketArgs } from '@pulumi/gcp/storage';
// class Dataflow implements JobArgs {}

class EventLocal {
  constructor(
    private name: string,
    private schema: Avro[],
    private subscribers: Partial<Array<JobArgs>> // private topic: TopicArgs, // private storage: BucketArgs // private topic: TopicArgs // private topic: TopicArgs, // private storage: BucketArgs
  ) {}
}

// const newTopic = new gcp.pubsub.Topic('my-topic', {
//   name: 'my-topic',
//   schemaSettings: {
//     schema: generateAvro(event1),
//   },
// });
const temp = new gcp.storage.Bucket('temp-bucket', {
  name: `${project}-temp-bucket`,
  location: region,
  forceDestroy: true,
  labels: {
    type: 'temp',
    team: 'util',
  },
});

const storage = new gcp.storage.Bucket('clients-events-bucket', {
  name: 'clients-events-bucket',
  location: region,
  forceDestroy: true,
  labels: {
    type: 'events',
    team: 'big-data',
  },
});
// storage.onObjectFinalized(
//   'finalized-clients-events-bucket',
//   {
//     description: 'Saving events by tenant id new buckets',
//     bucket: '',
//   },
//   {}
// );
// const eve1 = new EventLocal('event1', event1, [
//   {
//     // name: 'asd',
//     templateGcsPath: '',
//     tempGcsLocation: '',
//     parameters: {},
//   },
// ]);

const events = [
  {
    name: 'event1',
    schema: event1,
    pubsubSchema: JSON.stringify(bigquerySchema),
    subscribers: {},
  },
  {
    name: 'event2',
    schema: event2,
    subscribers: {
      Cloud_PubSub_to_GCS_Text: {},
    },
  },
];

// const table = new gcp.bigquery.Table('test-for-env', {
//   datasetId: dataset.datasetId,
//   tableId: 'my-test-tble',
//   deletionProtection: false,
//   timePartitioning: {
//     type: 'MONTH',
//   },
//   schema: JSON.stringify(bigquerySchema),
// });

// export const tabl = table;

events.map((event) => {
  const { name } = event;
  const schema = new gcp.pubsub.Schema(name, {
    name,
    type: 'AVRO',
    definition: generateAvro(event.schema),
  });

  const topic = new gcp.pubsub.Topic(name, {
    name,
    schemaSettings: {
      schema: schema.id,
      encoding: 'JSON',
    },
  });

  const pubsubToText = new gcp.dataflow.Job(`${name}-ps-to-gcs-text`, {
    region,
    name: `${name}-ps-to-gcs-text`,
    templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text',
    tempGcsLocation: pulumi.interpolate`${temp.url}/temp`,
    parameters: {
      inputTopic: topic.id,
      outputDirectory: pulumi.interpolate`${storage.url}/text/${name}`,
      outputFilenamePrefix: `${name}-ps-to-text`,
    },
    onDelete: 'cancel',
  });

  const pubsubToAvro = new gcp.dataflow.Job(`${name}-ps-to-avro`, {
    region,
    name: `${name}-ps-to-avro`,
    templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_Avro',
    tempGcsLocation: pulumi.interpolate`${temp.url}}/temp`,
    parameters: {
      inputTopic: topic.id,
      outputDirectory: pulumi.interpolate`${storage.url}/avro/${name}`,
      avroTempDirectory: pulumi.interpolate`${temp.url}/temp/${name}`,
    },
    onDelete: 'cancel',
  });

  const table = new gcp.bigquery.Table(name, {
    datasetId: dataset.datasetId,
    tableId: name,
    deletionProtection: false,
    timePartitioning: {
      type: 'MONTH',
    },
    labels: {
      env: 'default',
      event: name,
    },
    schema: JSON.stringify(bigquerySchema),
  });

  const bigquery_streaml = new gcp.dataflow.Job(`${name}-ps-to-bq`, {
    templateGcsPath:
      'gs://dataflow-templates-europe-north1/latest/PubSub_to_BigQuery',
    tempGcsLocation: pulumi.interpolate`${temp.url}/temp`,
    parameters: {
      inputTopic: topic.id,
      outputTableSpec: pulumi.interpolate`${project}:${table.datasetId}.${name}`,
    },
    onDelete: 'cancel',
  });
});

// });
// Export the DNS name of the bucket
// export const bucketName = tempFolder.url;
// export const schemas = schema;

// todo service
// const services = ['bi-service'];
// const project1 = gcp.organizations.getProject({});
//
// const secret = new gcp.secretmanager.Secret(
//   'secret',
//   {
//     secretId: 'secret11',
//     replication: {
//       automatic: true,
//     },
//   },
//   {
//     // provider: google_beta,
//   }
// );
//
// const secret_version_data = new gcp.secretmanager.SecretVersion(
//   'secret-version-data',
//   {
//     secret: secret.name,
//     secretData:
//       'mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/',
//   },
//   {
//     // provider: google_beta,
//   }
// );
// const secret_access = new gcp.secretmanager.SecretIamMember(
//   'secret-access',
//   {
//     secretId: secret.id,
//     role: 'roles/secretmanager.secretAccessor',
//     member: project1.then(
//       (project) =>
//         `serviceAccount:${project.number}-compute@developer.gserviceaccount.com`
//     ),
//   },
//   {
//     // provider: google_beta,
//     dependsOn: [secret],
//   }
// );

// services.map((service) => {
//   const myImage = new docker.Image(service, {
//     imageName: pulumi.interpolate`eu.gcr.io/${project}/${service}:1.2.8`,
//     build: {
//       context: `../../../apps/big-data/${service}`,
//       env: {},
//     },
//   });
//
//   const serv = new gcp.cloudrun.Service(
//     service,
//     {
//       location,
//       name: service,
//       // traffics: [
//       //   {
//       //     percent: 25,
//       //     revisionName: `${service}-green`,
//       //   },
//       //   {
//       //     latestRevision: true,
//       //     percent: 75,
//       //   },
//       // ],
//       // autogenerateRevisionName: true,
//       template: {
//         metadata: {
//           name: `${service}-green`,
//         },
//         spec: {
//           containers: [
//             {
//               image: myImage.imageName,
//               envs: [
//                 {
//                   name: 'MONGO_URI',
//                   value:
//                     'mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/',
//                   // valueFrom: {
//                   //   secretKeyRef: {
//                   //     name: secret.secretId,
//                   //     key: 'latest',
//                   //   },
//                   // },
//                 },
//               ],
//             },
//           ],
//         },
//       },
//     },
//     { dependsOn: [myImage] }
//   );
//   return new gcp.cloudrun.IamMember('hello-everyone', {
//     service: serv.name,
//     location,
//     role: 'roles/run.invoker',
//     member: 'allUsers',
//   });
// });
//

// const loggingBucket = new gcp.storage.Bucket('logging-bucket', {
//   name: 'loggin-bucket-for-buckets',
//   location: region,
//   forceDestroy: true,
//   labels: {
//     name: 'logging',
//   },
// });
//
// class Storage extends pulumi.ComponentResource {
//   constructor(name: string, opts?: ResourceOptions) {
//     super('mussia8:utils:Storage', name, {}, opts);
//
//     const storage = new gcp.storage.Bucket(name, {
//       name: name,
//       location: region,
//       versioning: { enabled: true },
//       forceDestroy: true,
//       // logging: { logBucket: loggingBucket.url },
//     });
//   }
// }
//
// const storageInstance = new Storage('yuri-my-storage', {});
