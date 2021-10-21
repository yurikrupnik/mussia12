import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { generateAvro } from '../utils/createAvroSchema';
import last from 'lodash/last';
import { GcpFunctionResource, GcpFunction } from '../modules/gcp-function';
import { Avro, BigquerySchema } from '../types';
import { JobArgs } from '@pulumi/gcp/dataflow';
import { Dataset } from '@pulumi/gcp/bigquery';
import { Bucket } from '@pulumi/gcp/storage';

const config = new pulumi.Config();
const region = config.get('region') || 'europe-west1';
const project = config.get('project') || 'mussia8';

export type EventsList = 'event1' | 'event2' | 'event3';

export class EventClass {
  constructor(
    readonly name: EventsList,
    readonly avroSchema: Avro[],
    readonly funcs: GcpFunction[],
    readonly eventStorageJob: JobArgs[],
    readonly dataset: Dataset,
    readonly tempBucket: Bucket, // temp bucket
    readonly bigquerySchema?: BigquerySchema[],
    readonly bucket?: Bucket // bucket for saving events to gcs
  ) {}
}

export class EventPipe extends pulumi.ComponentResource {
  constructor(name: string, event: EventClass, opts?: pulumi.ResourceOptions) {
    super('mussia8:utils:topic-pipe:', name, {}, opts);
    const {
      bigquerySchema,
      funcs,
      bucket,
      eventStorageJob,
      tempBucket,
      dataset,
      avroSchema,
    } = event;

    const schema = new gcp.pubsub.Schema(
      name,
      {
        name,
        type: 'AVRO',
        definition: generateAvro(avroSchema),
      },
      { parent: this }
    );

    const topic = new gcp.pubsub.Topic(
      name,
      {
        name,
        schemaSettings: {
          schema: schema.id,
          encoding: 'JSON',
        },
      },
      { parent: this }
    );

    const eventBucket =
      bucket ||
      new gcp.storage.Bucket(
        `${project}-${name}`,
        {
          name: `${project}-${name}`,
          location: region,
          forceDestroy: true,
        },
        { parent: this }
      );

    eventStorageJob.map((job) => {
      const { templateGcsPath } = job;
      const textOrAvro = last(
        templateGcsPath.toString().split('_')
      ).toLocaleLowerCase();
      return new gcp.dataflow.Job(
        `${name}-ps-to-gcs-${textOrAvro}`,
        {
          ...job,
          name: `${name}-ps-to-gcs-${textOrAvro}`,
          parameters: Object.assign({}, job.parameters, {
            inputTopic: topic.id,
            outputDirectory: eventBucket.url,
            outputFilenamePrefix:
              textOrAvro === 'text' ? `${name}-ps-to-${textOrAvro}` : undefined,
            avroTempDirectory:
              textOrAvro === 'avro' ? tempBucket.url : undefined,
          }),
        },
        { parent: this }
      );
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
    if (bigquerySchema) {
      const table = new gcp.bigquery.Table(
        name,
        {
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
        },
        { parent: this }
      );

      const bigquery_streaml = new gcp.dataflow.Job(
        `${name}-ps-to-bq`,
        {
          templateGcsPath:
            'gs://dataflow-templates-europe-north1/latest/PubSub_to_BigQuery',
          tempGcsLocation: tempBucket.url,
          parameters: {
            inputTopic: topic.id,
            outputTableSpec: pulumi.interpolate`${project}:${table.datasetId}.${name}`,
          },
          onDelete: 'cancel',
        },
        { parent: this }
      );
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

      updatedFuncs.map((func) => {
        return new GcpFunctionResource(func.name, func, { parent: this });
      });
      // createGcpFunctions(updatedFuncs);
    }
    // functions end
  }
}
