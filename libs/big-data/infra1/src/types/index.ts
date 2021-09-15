import { BucketArgs } from '@pulumi/gcp/storage/bucket';
// import { FunctionArgs } from '@pulumi/gcp/cloudfunctions';
import { Bucket } from '@pulumi/gcp/storage';

export type BucketArgsSelf = BucketArgs & {
  name: string;
};

export type GcpFunction = {
  name: string;
  region: string;
  bucket: Bucket;
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
