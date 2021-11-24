import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { events } from '@mussia12/shared/data-types';
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub();

function cd(topic, message) {
  const buffer = Buffer.from(JSON.stringify(message));
  return (
    pubsub
      .topic(topic)
      .publishMessage({ data: buffer })
      // .then((message) => {
      //   return { message };
      // })
      .catch((err) => {
        throw new NotAcceptableException(err.details);
      })
  );
}

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getData(): { message: string } {
    const dbUser = this.configService.get<string>('MONGO_URI');
    return { message: dbUser };
  }

  publishTopic(topic: events, message: any): Promise<[string]> {
    const buffer = Buffer.from(JSON.stringify(message));
    return pubsub
      .topic(topic)
      .publishMessage({ data: buffer })
      .catch((err) => {
        throw new NotAcceptableException(err.details);
      });
  }
}
