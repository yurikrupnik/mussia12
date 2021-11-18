import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { GcpFunctionResource, GcpFunction } from './src/modules/gcp-function';
import { EventPipe, EventClass } from './src/resources/event';
// import { GcpCloudRunResource } from './src/resources/cloud-run';
import {
  event1AvroFields,
  event1BigquerySchema,
  event2AvroFields,
} from './src/schemas';

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

const funcs = functions.map((f) => {
  // return new GcpFunctionResource(f.name, f);
});

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

const qa = pulumi.output(
  gcp.secretmanager.getSecret({
    secretId: 'projects/41381952215/secrets/MONGO_URI',
  })
);

export const qaa = qa;

const events: EventClass[] = [
  {
    dataset,
    tempBucket: temp,
    bucket: undefined, //eventsBucket,
    name: 'event1',
    avroSchema: event1AvroFields,
    bigquerySchema: event1BigquerySchema,
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
      // function listens to publish topic - resource is updated with the topic
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
          // ds: pulumi.output(
          //   gcp.secretmanager.getSecret({
          //     secretId: 'projects/41381952215/secrets/MONGO_URI',
          //   })
          // ),
          // todo fetch vars from gcp secrets/pulumi secrets
          MONGO_URI:
            'mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/',
        },
      },
      // function listens to bucket object creation - resource is updated with the bucket
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
  {
    dataset,
    tempBucket: temp,
    name: 'event2',
    funcs: [],
    eventStorageJob: [],
    avroSchema: event2AvroFields,
    // bucket
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
  // return new EventPipe(event.name, event, {});
});

// const service = new GcpCloudRunResource('bi-service', {
//   serviceFolder: `../../../apps/big-data`,
//   serviceArgs: {
//     location: region,
//   },
// });
