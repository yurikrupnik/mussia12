import { Avro } from '../types';

export const event2AvroFields: Avro[] = [
  {
    name: 'userId',
    type: 'string',
    description: 'Current user id',
  },
  {
    name: 'tenantId',
    type: 'string',
    description: 'Tenant Id',
  },
];
