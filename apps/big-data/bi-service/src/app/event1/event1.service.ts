import { Injectable } from '@nestjs/common';
import { CreateEvent1Dto } from './dto/create-event1.dto';
import { UpdateEvent1Dto } from './dto/update-event1.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Event1, Event1Document } from '@mussia12/shared/mongoose-schemas';
import { Connection, Model, QueryOptions } from 'mongoose';

@Injectable()
export class Event1Service {
  constructor(
    @InjectModel(Event1.name) private model: Model<Event1Document>,
    @InjectConnection() private connection: Connection
  ) {}

  async findAll(query, projection, config: QueryOptions): Promise<Event1[]> {
    return this.model.find(query, projection, config).lean();
  }

  async findOne(id: string, projection): Promise<Event1> {
    return this.model.findById(id, projection).lean();
  }

  create(body: CreateEvent1Dto): Promise<Event1> {
    return new this.model(body).save();
  }

  async update(id: string, body: Partial<UpdateEvent1Dto>): Promise<Event1> {
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

  remove(id: string): Promise<string> {
    return this.model.findByIdAndDelete(id).then((res) => res._id);
  }
}
