import { BucketArgs } from '@pulumi/gcp/storage/bucket';
import { FunctionArgs } from '@pulumi/gcp/cloudfunctions';
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
