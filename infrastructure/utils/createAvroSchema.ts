import { Avro } from '../types';

function generateAvro(fields: Array<Avro>) {
  return `
    {
      type: 'record',
      name: 'Avro',
      fields: ${fields},
    }
  `;
}

export { generateAvro };
