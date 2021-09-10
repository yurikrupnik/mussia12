import { Avro } from '../types';

const event1: Avro[] = [
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

export { event1 };
