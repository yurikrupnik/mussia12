import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './users';
import { ApiProperty } from '@nestjs/swagger';

export type Event2Document = Event2 & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Event2 {
  readonly _id?: string;

  @ApiProperty({
    description: `User Id`,
    example: 'dsdsds12345',
  })
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  userId: User;

  @ApiProperty({
    description: `Tenant Id`,
    example: 'some-id',
  })
  @Prop({
    index: true,
    required: true,
  })
  tenantId: string;
}

export const Event2Schema = SchemaFactory.createForClass(Event2);
