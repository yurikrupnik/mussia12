import * as pulumi from '@pulumi/pulumi';
import * as path from 'path';
// import { Input } from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
// import {SchemaState} from '@pulumi/gcp/pubsub/schema';
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
};

const events: Event[] = [
  {
    name: 'event1',
    schema: event1,
  },
  {
    name: 'event2',
    schema: event2,
  },
];

const dataset = new gcp.bigquery.Dataset('my-data-set', {
  datasetId: 'my_dataset_test',
  description: 'This is a test description',
  friendlyName: 'Test logs',
  location,
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

const table = new gcp.bigquery.Table('my-table', {
  datasetId: dataset.datasetId,
  tableId: 'my-table',
  description: 'my table for agent logs',
  deletionProtection: false,
  timePartitioning: {
    type: 'DAY',
  },
});
const beLogsTable = new gcp.bigquery.Table('beLogsTable', {
  datasetId: dataset.datasetId,
  tableId: 'beLogsTable',
  deletionProtection: false,
  timePartitioning: {
    type: 'MONTH',
  },
  labels: {
    env: 'default',
  },
  schema: JSON.stringify(bigquerySchema),
});

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

  const pubsubStream = new gcp.dataflow.Job(`${name}-ps-to-gcs-text`, {
    region: location,
    name: `${name}-ps-to-gcs-text`,
    templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text',
    tempGcsLocation: pulumi.interpolate`${storages[0].url}/temp`,
    parameters: {
      inputTopic: topic.id,
      outputDirectory: pulumi.interpolate`${storages[2].url}/text/${name}`,
      outputFilenamePrefix: `${name}-ps-to-text-be-logs`,
    },
    onDelete: 'cancel',
  });

  const pubsubStream2 = new gcp.dataflow.Job(`${name}-ps-to-avro`, {
    region: location,
    name: `${name}-ps-to-avro`,
    templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_Avro',
    tempGcsLocation: pulumi.interpolate`${storages[0].url}/temp`,
    parameters: {
      inputTopic: topic.id,
      outputDirectory: pulumi.interpolate`${storages[2].url}/avro/${name}`,
      avroTempDirectory: pulumi.interpolate`${storages[0].url}/temp/${name}`,
    },
    onDelete: 'cancel',
  });

  const bigquery_streaml = new gcp.dataflow.Job(`${name}-ps-to-bq`, {
    templateGcsPath:
      'gs://dataflow-templates-europe-north1/latest/PubSub_to_BigQuery',
    tempGcsLocation: pulumi.interpolate`${storages[0].url}/temp`,
    parameters: {
      inputTopic: topic.id,
      outputTableSpec: beLogsTable.tableId,
      // outputTableSpec: 'mussia8:example_dataset.bar',
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
