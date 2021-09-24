import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  readonly _id?: string;

  @Prop()
  name: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
