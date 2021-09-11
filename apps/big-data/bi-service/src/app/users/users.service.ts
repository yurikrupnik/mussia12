import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { QueryOptions } from 'mongoose';
import { User, UserDocument } from '@mussia12/shared/mongoose-schemas';
// import { User } from '@mussia12/shared/data-types';
// type User = {
//   name: string;
//   id: string;
// };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    @InjectConnection() private connection: Connection
  ) {}

  async findAll(query, projection, config: QueryOptions): Promise<User[]> {
    return this.model.find(query, projection, config).lean();
  }

  async findOne(id: string, projection): Promise<User> {
    return this.model.findById(id, projection).lean();
  }

  create(body: User): Promise<User> {
    return new this.model(body).save();
  }

  async update(id: string, body: User): Promise<User> {
    return this.model.findOneAndUpdate(
      {
        _id: id,
      },
      body,
      {
        new: true,
        useFindAndModify: false,
      }
    );
  }

  delete(id: string): Promise<string> {
    return this.model.findByIdAndDelete(id).then((res) => res._id);
  }
}
