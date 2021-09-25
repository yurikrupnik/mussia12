import { BucketArgs } from '@pulumi/gcp/storage/bucket';
// import { FunctionArgs } from '@pulumi/gcp/cloudfunctions';
import { Bucket } from '@pulumi/gcp/storage';
import { FunctionArgs } from '@pulumi/gcp/cloudfunctions';
// import * as pulumi from '@pulumi/pulumi';
// import { FailurePolicy } from '@pulumi/gcp/cloudfunctions/zMixins';

export type BucketArgsSelf = BucketArgs & {
  name: string;
};

// FunctionArgs['eventTrigger']
// {
//     eventType: string;
//     failurePolicy?: {
//       retry: boolean;
//     };
//     resource: string;
//   };
export type GcpFunction = {
  name: string;
  region: string;
  path: string;
  bucket: Bucket;
  member?: string;
  eventTrigger?: FunctionArgs['eventTrigger'];
  environmentVariables?: FunctionArgs['environmentVariables'];
};

export type Avro = {
  name: string;
  description: string;
  type:
    | 'null'
    | 'boolean'
    | 'int'
    | 'long'
    | 'float'
    | 'double'
    | 'bytes'
    | 'string';
};

// class Event1 {
//   constructor(
//     private tenantId: string,
//     private userId: string,
//     private inField: number
//   ) {}
// }

interface Event1 {
  stringField: string;
  intField: number;
  tenantId: string;
}
interface Event2 {
  userField: string;
  intField: number;
  tenantId: string;
}

export type BigquerySchema = {
  name: string;
  mode: 'REQUIRED' | 'NULLABLE' | 'REPEATED';
  type: BigquerySchemaTypes;
  description: string;
};

export type BigquerySchemaTypes =
  | 'STRING'
  | 'BYTES'
  | 'INTEGER'
  | 'FLOAT'
  | 'NUMERIC'
  | 'BIGNUMBER'
  | 'BOOLEAN'
  | 'TIMESTAMP'
  | 'DATE'
  | 'DATETIME'
  | 'GEOGRAPHY'
  | 'RECORD';

type UY = {
  message: Event1 | Event2;
  topic: 'event1' | 'event2';
};
