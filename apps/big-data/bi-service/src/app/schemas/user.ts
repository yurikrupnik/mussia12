import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypeOptions } from 'mongoose';
import { LoginProviders } from '@mussia12/shared/data-types';
//;

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  // @Prop({})
  // provider: LoginProviders;
  //
  // @Prop()
  // age: number;
  //
  // @Prop()
  // aris: string;
}

// const enums: [string in usersRoles] = [
//
// ]

// export const UserSchema: Record<keyof User, SchemaTypeOptions<any>> = {
//   creditCardNumber: {
//     type: String,
//     transform: (str: string) => {
//       if (str) {
//         return `****-****-****-${str.substr(str.length - 4)}`;
//       }
//       return null;
//     },
//     default: '',
//     // get: (str: string) => {
//     //     if (str) {
//     //         return `****-****-****-${str.substr(str.length - 4)}`;
//     //     }
//     //     return null;
//     // },
//   },
//   // aris: {
//   //     type: String,
//   //     default: "d",
//   // },
//   provider: {
//     type: String,
//     enum: ['local', 'google'],
//     default: 'local',
//   },
//   // id: {
//   //     type: String,
//   //     required() {
//   //         return this.provider !== "local";
//   //     }
//   // },
//   email: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     required: [true, 'Email address is required'],
//     // validate: [validateEmail, 'Please fill a valid email address'],
//     // match: [emailReg, "pls"],
//     // match: emailReg,
//     index: true,
//   },
//   // token: {
//   //     type: String,
//   //     default: ""
//   // },
//   password: {
//     type: String,
//     required() {
//       return this.provider === 'local';
//     },
//     // required: true,
//     // required: function() [{ return this.a === 'test'; }, 'YOUR CUSTOME MSG HERE']
//     // set: generateHashSync,
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'editor', 'finance', 'crm'],
//     default: 'admin',
//   },
//   image: {
//     type: String,
//     default: '',
//   },
//   firstName: {
//     type: String,
//     required() {
//       return this.provider !== 'local';
//     },
//   },
//   lastName: {
//     type: String,
//     required() {
//       return this.provider !== 'local';
//     },
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// };

export const UserSchema = SchemaFactory.createForClass(User);
// console.log('UserSchema', UserSchema);
