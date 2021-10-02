import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, QueryOptions } from 'mongoose';
import { Event2Document, Event2 } from '@mussia12/shared/mongoose-schemas';
import { CreateEvent2Dto } from './dto/create-event2.dto';
import { UpdateEvent2Dto } from './dto/update-event2.dto';

@Injectable()
export class Event2Service {
  constructor(
    @InjectModel(Event2.name) private model: Model<Event2Document>,
    @InjectConnection() private connection: Connection
  ) {}

  async findAll(query, projection, config: QueryOptions): Promise<Event2[]> {
    return this.model.find(query, projection, config).lean();
  }

  async findOne(id: string, projection): Promise<Event2> {
    return this.model.findById(id, projection).lean();
  }

  create(body: CreateEvent2Dto): Promise<Event2> {
    return new this.model(body).save();
  }

  async update(id: string, body: Partial<UpdateEvent2Dto>): Promise<Event2> {
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
