import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Event1Document = Event1 & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Event1 {
  readonly _id?: string;

  @Prop()
  stringField: string;

  @Prop({
    index: true,
    required: true,
  })
  tenantId: string;

  @Prop()
  intField: number;
}

export const Event1Schema = SchemaFactory.createForClass(Event1);
