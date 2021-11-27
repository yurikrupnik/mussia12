import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type Event3Document = Event3 & Document;

@Schema()
export class Event3 {
  @ApiProperty({
    description: `Tenant Id`,
    example: 'some-id-test',
  })
  @Prop({
    index: true,
    required: true,
  })
  tenantId: string;
}

export const Event3Schema = SchemaFactory.createForClass(Event3);
