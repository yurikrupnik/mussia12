import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { QueryOptions } from 'mongoose';
import { User, UserDocument } from '@mussia12/shared/mongoose-schemas';

@Injectable()
class Shit<T, U> {
  constructor(
    @InjectModel('User') private model: Model<U>,
    @InjectConnection() private connection: Connection
  ) {}

  async findAll(query, projection, config: QueryOptions): Promise<T[]> {
    return this.model.find(query, projection, config).lean();
  }

  async findOne(id: string, projection): Promise<T> {
    return this.model.findById(id, projection).lean();
  }
  //
  // create(body: T): Promise<T> {
  //   return new this.model(body).save();
  // }
  //
  // async update(id: string, body: Partial<T>): Promise<T> {
  //   return this.model.findOneAndUpdate(
  //     {
  //       _id: id,
  //     },
  //     body,
  //     {
  //       new: true,
  //       useFindAndModify: false,
  //     }
  //   );
  // }
  //
  // delete(id: string): Promise<string> {
  //   return this.model.findByIdAndDelete(id).then((res) => res._id);
  // }
}

@Injectable()
export class UsersService extends Shit<User, UserDocument> {}
