import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { bigquery } from '@pulumi/gcp';

const config = new pulumi.Config();

const project = config.get('project') || 'mussia8';
const location = config.get('location') || 'europe-west1';

function main() {}

export function storage() {
  const tempFolder = new gcp.storage.Bucket('temp-folder', {
    location,
    forceDestroy: true,
  });

  const functions = new gcp.storage.Bucket('big-data-functions', {
    location,
    forceDestroy: true,
  });

  const beEvents = new gcp.storage.Bucket('be-events', {
    location,
    forceDestroy: true,
  });

  const agentsEvents = new gcp.storage.Bucket('agents-events', {
    location,
    forceDestroy: true,
  });

  const coreEvents = new gcp.storage.Bucket('core-events', {
    location,
    forceDestroy: true,
  });
}

function pubSub() {
  const beLogsTopic = new gcp.pubsub.Topic('be-logs', {
    messageStoragePolicy: {
      allowedPersistenceRegions: [location],
    },
    // schemaSettings: [
    //   {
    //     schema: testSchema.,
    //     encoding: 'JSON',
    //   },
    // ],
  });
  const dl_be_logs = new gcp.pubsub.Topic('dead-letter-events', {
    name: 'dead-letter-events',
  }); // todo per type: be/fe/core/agent

  const be_logs_sub1 = new gcp.pubsub.Subscription(
    'be-logs-sub1',
    {
      topic: beLogsTopic.name,
      labels: {
        type: 'be-logs',
      },
      messageRetentionDuration: '1200s',
      retainAckedMessages: true,
      ackDeadlineSeconds: 20,
      expirationPolicy: {
        ttl: '300000.5s',
      },
      // retryPolicy: [
      //   {
      //     minimumBackoff: '10s',
      //   },
      // ],
      enableMessageOrdering: false,
      deadLetterPolicy: {
        deadLetterTopic: dl_be_logs.id,
        maxDeliveryAttempts: 10,
      },
    },
    {
      dependsOn: [dl_be_logs],
    }
  );
}

export function bigQuery() {
  const dataset = new gcp.bigquery.Dataset('dataset', {
    datasetId: 'example_dataset',
    friendlyName: 'Test logs dataset',
    description: 'This is a test description',
    location: 'EU',
    defaultTableExpirationMs: 3600000,
    labels: {
      env: 'default',
    },
  });
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

  const agentLogs = new bigquery.Table('events', {
    datasetId: dataset.datasetId,
    tableId: 'event_logs',
    deletionProtection: false,
    // labels: {
    //   env: 'env:agents',
    // },
    schema: JSON.stringify(list),
  });
}

export default main;
