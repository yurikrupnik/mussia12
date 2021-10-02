import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
// import { User } from './users';
import { ValidateNested, IsString, IsNumber } from 'class-validator';

export type Event1Document = Event1 & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Event1 {
  readonly _id?: string;

  @ApiProperty({
    description: `Not Acceptable status`,
    example: 'some string',
  })
  @Prop()
  @IsString()
  stringField: string;

  @ApiProperty({
    description: `Tenant id`,
    example: 'some tenant id',
  })
  @Prop({
    index: true,
    required: true,
  })
  @IsString()
  tenantId: string;

  @IsNumber()
  @ApiProperty({
    description: `Some Number`,
    example: 123,
    required: true,
  })
  @Prop()
  intField: number;
}

export const Event1Schema = SchemaFactory.createForClass(Event1);
