import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { GcpFunction } from './src/types';
import {GcpFunctionResource,} from './src/modules/gcp-function';
import {GcpBucket, GcpBucketResource} from './src/modules/bucket';

import { EventPipe, EventClass } from './src/resources/event';
// import {GcpFunctionResource} from '@mussia12/pulumi-gcp' // todo
import {
  event1AvroFields,
  event1BigquerySchema,
  event2AvroFields,
} from './src/schemas';

const config = new pulumi.Config();

const region = config.get('region') || 'europe-west1';
const project = config.get('project') || 'mussia8';

const functionsPath = '../../../dist/apps/big-data/';

const currentProject = pulumi.output(gcp.organizations.getProject({
  projectId: project
}))


const my_custom_role = new gcp.projects.IAMCustomRole("my-custom-role", {
  description: "A description",
  permissions: [
    "iam.roles.list",
    "iam.roles.create",
    "iam.roles.delete",
  ],
  roleId: "myCustomRole",
  title: "My Custom Role",
});

// export const currentProject_ = currentProject

const temp = new GcpBucketResource(`${project}-temp-bucket`, {region, project})

const admin = gcp.organizations.getIAMPolicy({
  bindings: [{
    role: "roles/storage.admin",
    members: ["user:krupnik.yuri@gmail.com"],
  }],
});

export const policy = new gcp.storage.BucketIAMPolicy("policy", {
  bucket: temp.bucket.name,
  policyData: admin.then(admin => admin.policyData),
});

// const bucketIAMBinding = new gcp.storage.BucketIAMBinding("BucketIAMBinding", {
//   members: ["user:krupnik.yuri@gmail.com"],
//   bucket: temp.bucket.name,
//   // project: "your-project-id",
//   role: "roles/storage.admin",
// });

// const d = new GcpBucketResource(`${project}-temp-bucket`, {region, project})

export const funcBucket = gcp.storage.Bucket.get(`gcf-sources-41381952215-${region}`, null)

// const default = gcp.storage.getTransferProjectServieAccount({project});
// export const defaultAccount = _default.then(_default => _default.email);

export const gcsAccount = gcp.storage.getProjectServiceAccount({});


// const binding = new gcp.pubsub.TopicIAMBinding("binding", {
//   topic: google_pubsub_topic.topic.name,
//   role: "roles/pubsub.publisher",
//   members: [gcsAccount.then(gcsAccount => `serviceAccount:${gcsAccount.emailAddress}`)],
// });
// const temp = new gcp.storage.Bucket('temp-bucket', {
//   name: `${project}-temp-bucket`,
//   location: region,
//   forceDestroy: true,
//   labels: {
//     type: 'temp',
//     team: 'util',
//   },
// });

// const eventsBucket = new gcp.storage.Bucket('events-bucket', {
//   name: `${project}-events-bucket`,
//   location: region,
//   forceDestroy: true,
//   labels: {
//     type: 'events',
//     team: 'big-data',
//   },
// });

// const funcBucket = new gcp.storage.Bucket(`${project}-func-bucket`, {
//   name: `${project}-func-bucket`,
//   location: region,
//   forceDestroy: true,
//   labels: {
//     type: 'code',
//     team: 'big-data',
//   },
// });

const functions: GcpFunction[] = [
  {
    name: 'publish-topic',
    region,
    bucket: funcBucket,
    path: functionsPath,
    member: 'allUsers',
  },
];

// const funcs = createGcpFunctions(functions);
// const funcs = functions.map((f) => {
//   return new GcpFunctionResource(f.name, f);
// });

// const dataset = new gcp.bigquery.Dataset('applications_events', {
//   datasetId: `${project}_applications_events`,
//   description: 'This is a test description',
//   friendlyName: 'Test logs',
//   location: region,
//   // defaultTableExpirationMs: 3600000,
//   labels: {
//     env: 'default',
//     name: 'aris-test',
//   },
// });

const qa = pulumi.output(
  gcp.secretmanager.getSecret({
    secretId: 'projects/41381952215/secrets/MONGO_URI',
  })
);

export const qaa = qa;

// const events: EventClass[] = [
//   {
//     dataset,
//     tempBucket: temp.bucket,
//     bucket: undefined, //eventsBucket,
//     name: 'event1',
//     avroSchema: event1AvroFields,
//     bigquerySchema: event1BigquerySchema,
//     eventStorageJob: [
//       {
//         templateGcsPath:
//           'gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text',
//         tempGcsLocation: temp.bucket.url,
//         region,
//         onDelete: 'cancel',
//       },
//       {
//         templateGcsPath: 'gs://dataflow-templates/latest/Cloud_PubSub_to_Avro',
//         tempGcsLocation: temp.bucket.url,
//         region,
//         onDelete: 'cancel',
//       },
//     ],
//     funcs: [
//       // function listens to publish topic - resource is updated with the topic
//       {
//         name: 'event1-subscription',
//         region,
//         bucket: funcBucket,
//         path: functionsPath,
//         eventTrigger: {
//           eventType: 'google.pubsub.topic.publish',
//           resource: undefined,
//           failurePolicy: {
//             retry: true,
//           },
//         },
//         environmentVariables: {
//           // ds: pulumi.output(
//           //   gcp.secretmanager.getSecret({
//           //     secretId: 'projects/41381952215/secrets/MONGO_URI',
//           //   })
//           // ),
//           // todo fetch vars from gcp secrets/pulumi secrets
//           MONGO_URI:
//             'mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/',
//         },
//       },
//       // function listens to bucket object creation - resource is updated with the bucket
//       {
//         name: 'storage-func',
//         region,
//         bucket: funcBucket,
//         path: functionsPath,
//         eventTrigger: {
//           eventType: 'google.storage.object.finalize',
//           resource: undefined,
//           failurePolicy: {
//             retry: true,
//           },
//         },
//         // member: 'allUsers',
//       },
//     ],
//   },
//   {
//     dataset,
//     tempBucket: temp.bucket,
//     name: 'event2',
//     funcs: [],
//     eventStorageJob: [],
//     avroSchema: event2AvroFields,
//     // bucket
//   },
//   // {
//   //   name: 'event2',
//   //   schema: event2,
//   //   subscribers: {
//   //     Cloud_PubSub_to_GCS_Text: {},
//   //   },
//   // },
// ];

// events.map((event) => {
//   return new EventPipe(event.name, event, {});
// });
