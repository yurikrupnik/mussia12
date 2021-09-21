import { Avro } from '../types';

function generateAvro(fields: Avro[]) {
  return `
    {
      "type": "record",
      "name": "Avro",
      "fields": ${JSON.stringify(fields)}
    }
  `;
}

export { generateAvro };
