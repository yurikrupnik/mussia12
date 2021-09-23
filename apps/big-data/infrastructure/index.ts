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

import { event1AvroFields, event2, event1BigquerySchema } from './src/schemas';

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
    member: 'allUsers',
  },
];

const funcs = createGcpFunctions(functions);
//
// type EventsEnum = 'event1AvroFields' | 'event2' | 'event3';
//
// type Event = {
//   name: EventsEnum;
//   schema: Avro[];
// };
//
//
const dataset = new gcp.bigquery.Dataset('applications_events', {
  datasetId: `${project}_applications_events`,
  description: 'This is a test description',
  friendlyName: 'Test logs',
  location: region,
  // defaultTableExpirationMs: 3600000,
  labels: {
    env: 'default',
    name: 'aris-test',
  },
});

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
//   schema: JSON.stringify(event1BigquerySchema),
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

const storage = new gcp.storage.Bucket('events-bucket', {
  name: `${project}-events-bucket`,
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
// const eve1 = new EventLocal('event1AvroFields', event1AvroFields, [
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
    avroSchema: event1AvroFields,
    pubsubSchema: event1BigquerySchema,
    // subscribers: {},
    functions: [],
  },
  // {
  //   name: 'event2',
  //   schema: event2,
  //   subscribers: {
  //     Cloud_PubSub_to_GCS_Text: {},
  //   },
  // },
];

// const table = new gcp.bigquery.Table('test-for-env', {
//   datasetId: dataset.datasetId,
//   tableId: 'my-test-tble',
//   deletionProtection: false,
//   timePartitioning: {
//     type: 'MONTH',
//   },
//   schema: JSON.stringify(event1BigquerySchema),
// });

// export const tabl = table;

events.map((event) => {
  const { name, pubsubSchema } = event;
  const schema = new gcp.pubsub.Schema(name, {
    name,
    type: 'AVRO',
    definition: generateAvro(event.avroSchema),
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

  // bigquery start
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
    schema: JSON.stringify(pubsubSchema),
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
  // bigquery end

  // functions start

  // functions end
});

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
