import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { UserDocument, User } from '../schemas/user';
// type User = {
//   name: string;
//   id: string;
// };

@Injectable()
export class UsersService {
  // constructor(@InjectConnection() private connection: Connection) {}
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    @InjectConnection() private connection: Connection
  ) {}

  async findAll(): Promise<User[]> {
    return this.model.find().then((res) => {
      console.log({ res });
      return res;
    });
  }

  async findOne(id, projection): Promise<User> {
    return this.model.findById(id, projection);
  }

  async create(
    body: User,
    projection: [string] | string | undefined | null | any
  ): Promise<any> {
    // this.userModel.
    console.log('projection', projection);
    return this.model.create(body, null);
    // return this.userModel.create(body, projection);
  }
  // getData(): User[] {
  //   return [
  //     {
  //       name: 'aris',
  //       id: 'ds',
  //     },
  //     {
  //       name: 'aris1',
  //       id: 'ds1',
  //     },
  //   ];
  // }
  //
  // findOne(): User {
  //   return {
  //     name: 'aris',
  //     id: 'ds',
  //   };
  // }
}
