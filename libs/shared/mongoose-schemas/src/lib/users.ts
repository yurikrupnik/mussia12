import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { UserRoles, LoginProviders } from '@mussia12/shared/data-types';
import { userRoles, loginProviders } from '@mussia12/shared/data-types';

import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: `User id`,
    example: 'some id',
    // readOnly: true,
    required: false,
  })
  readonly _id?: string;

  @Prop()
  @ApiProperty({
    description: `User's name`,
    example: 'your name',
    readOnly: true,
  })
  name: string;

  @Prop({ type: String, enum: userRoles, default: userRoles[0] })
  role: UserRoles;
  //
  @Prop({
    index: true,
    required: true,
  })
  @ApiProperty({
    description: `User email`,
    example: 'a@a.com',
    // readOnly: true,
    required: true,
  })
  email: string;

  @Prop({ index: true })
  password: string;

  @Prop({ index: true })
  tenantId: string;

  @Prop({ type: String, enum: loginProviders, default: loginProviders[0] })
  provider: LoginProviders;
}

export const UserSchema = SchemaFactory.createForClass(User);
