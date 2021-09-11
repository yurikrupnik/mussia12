import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { UserRoles, LoginProviders } from '@mussia12/shared/data-types';
import { userRoles, loginProviders } from '@mussia12/shared/data-types';

export type UserDocument = User & Document;

@Schema()
export class User {
  readonly _id?: string;

  @Prop()
  name: string;

  @Prop({ type: String, enum: userRoles, default: userRoles[0] })
  role: UserRoles;
  //
  @Prop({
    index: true,
    required: true,
  })
  email: string;

  @Prop({ index: true })
  password: string;

  @Prop({ enum: loginProviders, default: loginProviders[0] })
  provider: LoginProviders;
}

export const UserSchema = SchemaFactory.createForClass(User);
