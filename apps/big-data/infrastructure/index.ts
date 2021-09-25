import * as pulumi from '@pulumi/pulumi';
import * as path from 'path';
import * as gcp from '@pulumi/gcp';
import { Bucket } from '@pulumi/gcp/storage';
import { JobArgs } from '@pulumi/gcp/dataflow';
import last from 'lodash/last';
import { GcpFunction, Avro, BigquerySchema } from './src/types';
import { generateAvro } from './src/utils/createAvroSchema';
import { createGcpFunctions } from './src/modules/gcp-function';
import { event1AvroFields, event2, event1BigquerySchema } from './src/schemas';

const config = new pulumi.Config();

const region = config.get('region') || 'europe-west1';
const project = config.get('project') || 'mussia8';

const functionsPath = '../../../dist/apps/big-data/';

const temp = new gcp.storage.Bucket('temp-bucket', {
  name: `${project}-temp-bucket`,
  location: region,
  forceDestroy: true,
  labels: {
    type: 'temp',
    team: 'util',
  },
});

const eventsBucket = new gcp.storage.Bucket('events-bucket', {
  name: `${project}-events-bucket`,
  location: region,
  forceDestroy: true,
  labels: {
    type: 'events',
    team: 'big-data',
  },
});

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

class EventClass {
  constructor(
    readonly name: EventsList,
    readonly bucket: Bucket, // bucket for saving events to gcs
    readonly avroSchema: Avro[],
    readonly pubsubSchema: BigquerySchema[],
    readonly funcs: GcpFunction[],
    readonly eventStorageJob?: JobArgs[]
  ) {}
}

type EventsList = 'event1' | 'event2' | 'event3';

const events: EventClass[] = [
  {
    bucket: undefined, //eventsBucket,
    name: 'event1',
    avroSchema: event1AvroFields,
    pubsubSchema: event1BigquerySchema,
    eventStorageJob: [
      {
        templateGcsPath:
          'gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text',
        tempGcsLocation: temp.url,
        region,
        onDelete: 'cancel',
      },
      {
        templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_Avro',
        tempGcsLocation: temp.url,
        region,
        onDelete: 'cancel',
      },
    ],
    funcs: [
      {
        name: 'event1-subscription',
        region,
        bucket: funcBucket,
        path: functionsPath,
        eventTrigger: {
          eventType: 'google.pubsub.topic.publish',
          resource: undefined,
          failurePolicy: {
            retry: true,
          },
        },
        environmentVariables: {
          // todo fetch vars from gcp secrets and/or using terraform
          MONGO_URI:
            'mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/',
        },
      },
      {
        name: 'storage-func',
        region,
        bucket: funcBucket,
        path: functionsPath,
        eventTrigger: {
          eventType: 'google.storage.object.finalize',
          resource: undefined,
          failurePolicy: {
            retry: true,
          },
        },
        // member: 'allUsers',
      },
    ],
  },
  // {
  //   name: 'event2',
  //   schema: event2,
  //   subscribers: {
  //     Cloud_PubSub_to_GCS_Text: {},
  //   },
  // },
];

events.map((event) => {
  const { name, pubsubSchema, funcs, bucket, eventStorageJob } = event;
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

  const eventBucket =
    bucket ||
    new gcp.storage.Bucket(`${project}-${name}`, {
      name: `${project}-${name}`,
      location: region,
      forceDestroy: true,
    });

  eventStorageJob.map((job) => {
    const { templateGcsPath } = job;
    const textOrAvro = last(
      templateGcsPath.toString().split('_')
    ).toLocaleLowerCase();
    return new gcp.dataflow.Job(`${name}-ps-to-gcs-${textOrAvro}`, {
      ...job,
      name: `${name}-ps-to-gcs-${textOrAvro}`,
      parameters: Object.assign({}, job.parameters, {
        inputTopic: topic.id,
        outputDirectory: eventBucket.url,
        outputFilenamePrefix:
          textOrAvro === 'text' ? `${name}-ps-to-${textOrAvro}` : undefined,
        avroTempDirectory: textOrAvro === 'avro' ? temp.url : undefined,
      }),
    });
  });
  // if (Array.isArray(eventStorageJob)) {
  // } else {
  // }
  // const pubsubToText = new gcp.dataflow.Job(`${name}-ps-to-gcs-text`, {
  //   region,
  //   name: `${name}-ps-to-gcs-text`,
  //   templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text',
  //   tempGcsLocation: temp.url,
  //   parameters: {
  //     inputTopic: topic.id,
  //     outputDirectory: eventBucket.url,
  //     outputFilenamePrefix: `${name}-ps-to-text`,
  //   },
  //   onDelete: 'cancel',
  // });
  //
  // const pubsubToAvro = new gcp.dataflow.Job(`${name}-ps-to-avro`, {
  //   region,
  //   name: `${name}-ps-to-avro`,
  //   templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_Avro',
  //   tempGcsLocation: temp.url,
  //   parameters: {
  //     inputTopic: topic.id,
  //     outputDirectory: eventBucket.url,
  //     avroTempDirectory: temp.url,
  //   },
  //   onDelete: 'cancel',
  // });

  // bigquery start
  if (pubsubSchema) {
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
      tempGcsLocation: temp.url,
      parameters: {
        inputTopic: topic.id,
        outputTableSpec: pulumi.interpolate`${project}:${table.datasetId}.${name}`,
      },
      onDelete: 'cancel',
    });
  }
  // bigquery end

  // functions start
  if (funcs.length) {
    const updatedFuncs = funcs.map((v) => {
      let resource;
      if (v.eventTrigger.eventType) {
        if (v.eventTrigger.eventType.includes('storage')) {
          resource = eventBucket.name;
        } else if (v.eventTrigger.eventType.includes('topic')) {
          resource = topic.id;
        }
        v.eventTrigger = Object.assign({}, v.eventTrigger, {
          resource,
        });
      }
      return v;
    });
    createGcpFunctions(updatedFuncs);
  }
  // functions end

  return {
    topic,
  };
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
