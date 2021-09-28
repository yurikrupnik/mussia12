import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { UserRoles, LoginProviders } from '@mussia12/shared/data-types';
import { userRoles, loginProviders } from '@mussia12/shared/data-types';
import { IsString, IsEmail, Min, Max } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop() readonly createdAt?: Date;
  @Prop() readonly updatedAt?: Date;

  @ApiProperty({
    description: `User id`,
    example: 'some id',
    readOnly: true,
    required: false,
  })
  readonly _id?: string;

  @Prop()
  @ApiProperty({
    description: `User's name`,
    example: 'your name',
    // readOnly: true,
  })
  @IsString()
  name: string;

  @Prop({ type: String, enum: userRoles, default: userRoles[0] })
  @ApiProperty({
    description: `User's role`,
    example: 'admin',
  })
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
  @IsEmail()
  email: string;

  @Prop({ index: true })
  @ApiProperty({
    description: `User's password`,
    example: '12345',
    // readOnly: true,
  })
  password?: string;

  @Prop({ index: true })
  @ApiProperty({
    description: `User's tenantId`,
    example: 'tenantid-1234-1244',
    // readOnly: true,
  })
  tenantId: string;

  @Prop({ type: String, enum: loginProviders, default: loginProviders[0] })
  @ApiProperty({
    description: `User's provider`,
    example: loginProviders[0],
    enum: loginProviders,
    default: loginProviders[0],
    required: true,
  })
  provider: LoginProviders;
}

export const UserSchema = SchemaFactory.createForClass(User);
