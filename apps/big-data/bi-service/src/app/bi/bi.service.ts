import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateBiDto } from './dto/create-bi.dto';
import { UpdateBiDto } from './dto/update-bi.dto';
import { ConfigService } from '@nestjs/config';
import { events } from '@mussia12/shared/data-types';
import { PubSub } from '@google-cloud/pubsub';
const pubsub = new PubSub();

@Injectable()
export class BiService {
  constructor(private configService: ConfigService) {}
  getData(): { message: string } {
    const dbUser = this.configService.get<string>('MONGO_URI');
    return { message: dbUser };
  }

  publishTopic(topic: events, message: any): Promise<string> {
    const buffer = Buffer.from(JSON.stringify(message));
    return (
      pubsub
        .topic(topic)
        .publish(buffer)
        // .then((message) => {
        //   return { message };
        // })
        .catch((err) => {
          throw new NotAcceptableException(err.details);
        })
    );
  }
}
