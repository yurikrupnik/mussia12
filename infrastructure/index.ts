import * as path from 'path';
import * as fs from 'fs';
import * as pulumi from '@pulumi/pulumi';
import { pubsub, storage, bigquery } from '@pulumi/gcp';
import { Avro } from './types';
import main, { bigQuery } from './pubsubShemages';
import { event1 } from './schemas';
import { generateAvro } from './utils/createAvroSchema';
import * as gcp from '@pulumi/gcp';

const config = new pulumi.Config();
const project = config.get('project') || 'mussia8';
const location = config.get('location') || 'europe-west1';
const zone = config.get('zone') || 'europe-west1-c';
const beLogsBucket = config.get('beLogsBucket') || 'be-logs-raw-data';
const agentLogsBucket = config.get('agentLogsBucket') || 'agent-logs-raw-data';
const bucketName = config.get('bucketName') || 'be-events-raw-data';
const prefix = config.getObject('prefix') || ['Mr', 'Mrs', 'Sir'];

const directoryPath = path.join(__dirname, 'events-schemas');

// Generate all schemas for PubSub
async function handleSchemas() {
  return fs.promises
    .readdir(directoryPath)
    .then((schemas) => {
      console.log('schemasss', schemas);
      return schemas.map((schema) => {
        return new pubsub.Schema(schema, {
          name: schema.split('.')[0],
          type: 'AVRO',
          definition: `events-schemas/${schema}`,
        });
      });
    })
    .catch((err) => {
      console.log('Failed to read events-schemas folder');
    });
}

// const schemas = handleSchemas();

// tempFolder fails!!
// const tempFolder = new gcp.storage.Bucket('temp-folder', {
//   location,
//   forceDestroy: true,
// });
//
// const functions = new gcp.storage.Bucket('big-data-functions', {
//   location,
//   forceDestroy: true,
// });
//
// const beEvents = new gcp.storage.Bucket('be-events', {
//   location,
//   forceDestroy: true,
// });
//
// const agentsEvents = new gcp.storage.Bucket('agents-events', {
//   location,
//   forceDestroy: true,
// });
//
// const coreEvents = new gcp.storage.Bucket('core-events', {
//   location,
//   forceDestroy: true,
// });

// Storage with retention
// const agent_logs_bucket = new gcp.storage.Bucket('agent-logs-bucket', {
//   forceDestroy: true,
//   location,
//   retentionPolicy: {
//     retentionPeriod: 6000,
//   },
//   lifecycleRules: [
//     {
//       condition: {
//         age: 30,
//       },
//       action: {
//         type: 'SetStorageClass',
//         storageClass: 'NEARLINE',
//       },
//     },
//   ],
// });
// // storage finalize for be-logs function
// const storage_func = new gcp.cloudfunctions.Function(
//   'storage-func',
//   {
//     description: 'My storage function',
//     runtime: 'nodejs16',
//     availableMemoryMb: 256,
//     sourceArchiveBucket: functions.name,
//     sourceArchiveObject: google_storage_bucket_object.archive.name,
//     eventTrigger: {
//       eventType: 'google.storage.object.finalize',
//       resource: beEvents.name,
//     },
//     timeout: 60,
//     entryPoint: 'storageFunc',
//     labels: {
//       'my-label': 'my-label-value1',
//       func: 'aris2',
//     },
//     environmentVariables: {
//       MY_ENV_VAR: 'my-env-var-value',
//     },
//   },
//   {
//     dependsOn: [beEvents],
//   }
// );
// const beLogsTopic = new gcp.pubsub.Topic(
//   'beLogsTopic',
//   {
//     messageStoragePolicy: {
//       allowedPersistenceRegions: [location],
//     },
//     schemaSettings: [
//       {
//         schema: google_pubsub_schema.events_schema1.id,
//         encoding: 'JSON',
//       },
//     ],
//   },
//   {
//     dependsOn: [google_pubsub_schema.events_schema1],
//   }
// );
// // pubsub function for be logs
// const topic_func = new gcp.cloudfunctions.Function(
//   'topic-func',
//   {
//     description: 'My topic function',
//     runtime: 'nodejs14',
//     availableMemoryMb: 256,
//     sourceArchiveBucket: functions.name,
//     sourceArchiveObject: google_storage_bucket_object.archive.name,
//     eventTrigger: {
//       eventType: 'google.pubsub.topic.publish',
//       resource: beLogsTopic.id,
//     },
//     timeout: 60,
//     entryPoint: 'storagePubSub',
//     labels: {
//       'my-label': 'my-label-d',
//       func: 'aris1',
//     },
//     environmentVariables: {
//       MY_ENV_VAR: 'my-env-var-ffd',
//     },
//   },
//   {
//     dependsOn: [beLogsTopic],
//   }
// );
// const workflow_func = new gcp.cloudfunctions.Function(
//   'workflow-func',
//   {
//     description: 'My topic function',
//     runtime: 'nodejs14',
//     availableMemoryMb: 256,
//     sourceArchiveBucket: functions.name,
//     sourceArchiveObject: google_storage_bucket_object.archive.name,
//     eventTrigger: {
//       eventType: 'google.pubsub.topic.publish',
//       resource: beLogsTopic.id,
//     },
//     timeout: 60,
//     entryPoint: 'runWorkflow',
//     labels: {
//       'my-label': 'my-label-d',
//       func: 'aris1',
//     },
//     environmentVariables: {
//       MY_ENV_VAR: 'my-env-var-ffd',
//       MY_ENV_VAR1: 'my-env-var-4',
//     },
//   },
//   {
//     dependsOn: [beLogsTopic],
//   }
// );
// const saveToDb = new gcp.cloudfunctions.Function('saveToDb', {
//   description: 'Saving to mongodb collection per document and returns new item',
//   runtime: 'nodejs14',
//   availableMemoryMb: 256,
//   sourceArchiveBucket: functions.name,
//   sourceArchiveObject: google_storage_bucket_object.archive.name,
//   triggerHttp: true,
//   timeout: 60,
//   entryPoint: 'saveToDb',
//   ingressSettings: 'ALLOW_ALL',
// });
// const invoker1 = new gcp.cloudfunctions.FunctionIamMember('invoker1', {
//   project: saveToDb.project,
//   region: saveToDb.region,
//   cloudFunction: saveToDb.name,
//   role: 'roles/cloudfunctions.invoker',
//   member: 'allUsers',
// });
// const publishPs = new gcp.cloudfunctions.Function('publishPs', {
//   description: 'Generic function to publish event to PubSub',
//   runtime: 'nodejs14',
//   availableMemoryMb: 256,
//   sourceArchiveBucket: functions.name,
//   sourceArchiveObject: google_storage_bucket_object.archive.name,
//   triggerHttp: true,
//   timeout: 60,
//   entryPoint: 'callPubSub',
//   ingressSettings: 'ALLOW_ALL',
// });
// const invoker2 = new gcp.cloudfunctions.FunctionIamMember('invoker2', {
//   project: publishPs.project,
//   region: publishPs.region,
//   cloudFunction: publishPs.name,
//   role: 'roles/cloudfunctions.invoker',
//   member: 'allUsers',
// });

// const schema: Avro[] = [
//   {
//     name: 'stringField',
//     type: 'bytes',
//     description: 'Testing string fields',
//   },
//   {
//     name: 'intField',
//     type: 'int',
//     description: 'Testing int field',
//   },
//   {
//     name: 'tenantId',
//     type: 'string',
//     description: 'Tenant Id',
//   },
// ];

const events = {
  'be-event1': {
    fields: event1,
    customDa: 'my custom field',
  },
};

let assetArchive = new pulumi.asset.AssetArchive({
  event1: new pulumi.asset.StringAsset(generateAvro(event1)),
  folder: new pulumi.asset.FileArchive('../scripts'),
  // agent1: new pulumi.asset.FileArchive('./events-schemas/agent-event1.json'),
});

bigQuery();

const tempFolder = new storage.Bucket('temp-folder', {
  location,
  forceDestroy: true,
});

const bigData = new storage.Bucket('big-data-schemas', {
  // pubsub - bigquery
  location,
  forceDestroy: true,
});

// const archive0 = new storage.BucketObject('pubsub-schemas0', {
//   name: `big-data-pubsub-schemas.json`,
//   bucket: tempFolder.name,
//   source: assetArchive,
// });
// const archive = new storage.BucketObject('pubsub-schemas', {
//   name: `big-data-pubsub-schemas.zip`,
//   bucket: tempFolder.name,
//   source: assetArchive.assets.then((aasets) => {
//     console.log({ aasets });
//     return aasets.avro1;
//   }),
// });
// Fails Todo ASAP most basic
// const testSchema = new pubsub.Schema('test-schema', {
//   name: 'test-schema',
//   type: 'AVRO',
//   definition: `
//     {
//       type: 'record',
//       name: 'Avro',
//       fields: [
//   {
//     name: 'stringField',
//     type: 'bytes',
//     description: 'Testing string fields',
//   },
//   {
//     name: 'intField',
//     type: 'int',
//     description: 'Testing int field',
//   },
//   {
//     name: 'tenantId',
//     type: 'string',
//     description: 'Tenant Id',
//   },
// ],
//     }
//   `,
//   // definition: './events-schemas/agent-event1.json',
// });

// const beLogsTopic = new pubsub.Topic('be-logs', {
//   messageStoragePolicy: {
//     allowedPersistenceRegions: [location],
//   },
//   // schemaSettings: [
//   //   {
//   //     schema: testSchema.,
//   //     encoding: 'JSON',
//   //   },
//   // ],
// });

// const dl_be_logs = new gcp.pubsub.Topic('dead-letter-events', {
//   name: 'dead-letter-events',
// }); // todo per type: be/fe/core/agent
//
// const be_logs_sub1 = new gcp.pubsub.Subscription(
//   'be-logs-sub1',
//   {
//     topic: beLogsTopic.name,
//     labels: {
//       type: 'be-logs',
//     },
//     messageRetentionDuration: '1200s',
//     retainAckedMessages: true,
//     ackDeadlineSeconds: 20,
//     expirationPolicy: {
//       ttl: '300000.5s',
//     },
//     // retryPolicy: [
//     //   {
//     //     minimumBackoff: '10s',
//     //   },
//     // ],
//     enableMessageOrdering: false,
//     deadLetterPolicy: {
//       deadLetterTopic: dl_be_logs.id,
//       maxDeliveryAttempts: 10,
//     },
//   },
//   {
//     dependsOn: [dl_be_logs],
//   }
// );
// const publishToClient = new gcp.cloudfunctions.Function('publishToClient', {
//   description: 'Saving to mongodb collection per document and returns new item',
//   runtime: 'nodejs14',
//   availableMemoryMb: 256,
//   sourceArchiveBucket: functions.name,
//   sourceArchiveObject: google_storage_bucket_object.archive.name,
//   triggerHttp: true,
//   timeout: 60,
//   entryPoint: 'publishToClient',
//   ingressSettings: 'ALLOW_ALL',
// });
// const invoker = new gcp.cloudfunctions.FunctionIamMember('invoker', {
//   project: publishToClient.project,
//   region: publishToClient.region,
//   cloudFunction: publishToClient.name,
//   role: 'roles/cloudfunctions.invoker',
//   member: 'allUsers',
// });
// const pubsubStream = new gcp.dataflow.Job('pubsubStream', {
//   templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text',
//   tempGcsLocation: pulumi.interpolate`${tempFolder.url}/temp`,
//   parameters: {
//     inputTopic: beLogsTopic.id,
//     outputDirectory: pulumi.interpolate`${beEvents.url}/text`,
//     outputFilenamePrefix: 'ps-to-text-be-logs',
//   },
//   onDelete: 'cancel',
// });
// const pubsubStream2 = new gcp.dataflow.Job('pubsubStream2', {
//   templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_Avro',
//   tempGcsLocation: pulumi.interpolate`${tempFolder.url}/temp`,
//   parameters: {
//     inputTopic: beLogsTopic.id,
//     outputDirectory: pulumi.interpolate`${beEvents.url}/avro`,
//     avroTempDirectory: pulumi.interpolate`${beEvents.url}/temp`,
//   },
//   onDelete: 'cancel',
// });
// const bigquery_stream = new gcp.dataflow.Job('bigquery-stream', {
//   templateGcsPath:
//     'gs://dataflow-templates-europe-north1/latest/PubSub_to_BigQuery',
//   tempGcsLocation: pulumi.interpolate`${tempFolder.url}/temp`,
//   parameters: {
//     inputTopic: 'projects/mussia8/topics/be_logs',
//     outputTableSpec: 'mussia8:example_dataset.bar',
//   },
//   onDelete: 'cancel',
// });

// Todo handle it fails with creating table
//  access {
//    role          = "OWNER"
//    user_by_email = google_service_account.bqowner.email
//  }
//
//  access {
//    role   = "READER"
//    domain = "hashicorp.com"
//  }
// const default2 = new gcp.bigquery.Table('default2', {
//   datasetId: dataset.datasetId,
//   tableId: 'agents_logs',
//   deletionProtection: false,
//   labels: {
//     env: 'agents',
//   },
// });

// const beLogsBigquery_tableTable = new gcp.bigquery.Table(
//   'beLogsBigquery/tableTable',
//   {
//     datasetId: dataset.datasetId,
//     tableId: 'be_logs',
//     deletionProtection: false,
//     timePartitioning: {
//       type: 'DAY',
//     },
//     labels: {
//       // env: 'env=be', fails
//     },
//   }
// );
//
const list = [
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
];

// const dataset = new gcp.bigquery.Dataset('dataset', {
//   datasetId: 'example_dataset',
//   friendlyName: 'Test logs dataset',
//   description: 'This is a test description',
//   location: 'EU',
//   defaultTableExpirationMs: 3600000,
//   labels: {
//     env: 'default',
//   },
// });
// const agentLogs = new bigquery.Table('events', {
//   datasetId: dataset.datasetId,
//   tableId: 'agent_logs',
//   deletionProtection: false,
//   // labels: {
//   //   env: 'env:agents',
//   // },
//   schema: JSON.stringify(list),
// });
//
// const beLogsTable = new gcp.bigquery.Table('beLogsTable', {
//   datasetId: dataset.datasetId,
//   tableId: 'bar',
//   deletionProtection: false,
//   timePartitioning: {
//     type: 'MONTH',
//   },
//   labels: {
//     env: 'default',
//   },
//   schema: JSON.stringify(list),
// });
