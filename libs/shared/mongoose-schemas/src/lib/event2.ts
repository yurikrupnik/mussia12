import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Event2Document = Event2 & Document;

@Schema()
export class Event2 {
  readonly _id?: string;

  @Prop({ index: true, required: true })
  userId: string;

  @Prop({
    index: true,
    required: true,
  })
  tenantId: string;

  @Prop({
    index: true,
    required: true,
  })
  timestamp: Date;
}

export const Event2Schema = SchemaFactory.createForClass(Event2);
