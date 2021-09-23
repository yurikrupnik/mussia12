import { Avro, BigquerySchema } from '../types';

const event1AvroFields: Avro[] = [
  {
    name: 'stringField',
    type: 'string',
    description: 'Testing string fields',
  },
  {
    name: 'intField',
    type: 'int',
    description: 'Testing int field',
  },
  {
    name: 'tenantId',
    type: 'string',
    description: 'Tenant Id',
  },
];

const event1BigquerySchema: BigquerySchema[] = [
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
    mode: 'REQUIRED',
    description: 'Tenant Id',
  },
];

// const Event

interface Event1 {
  stringField: string;
  intField: number;
  tenantId: string;
}

export { event1AvroFields, Event1, event1BigquerySchema };
