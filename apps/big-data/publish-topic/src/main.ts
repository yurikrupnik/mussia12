import { PubSub } from '@google-cloud/pubsub';
import type { Request, Response } from 'express';
const pubsub = new PubSub();

type events = 'be-1' | 'agent-1' | 'fe-s1' | 'd-s' | 'be_logs' | 'log-ing';

type eve1 = {
  'be-1': {
    ip: string;
    host: string;
  };
  'log-in': {
    userId: string;
  };
};

function publishPubSubMessage(topic: events, message: any) {
  const buffer = Buffer.from(JSON.stringify(message));
  return pubsub.topic(topic).publish(buffer);
}

const publishTopic = (req: Request, res: Response) => {
  const { topic } = req.body;
  delete req.body.topic;
  publishPubSubMessage(topic, req.body)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log('Failed send PubSub topic', err); // eslint-disable-line
    });
};

export { publishTopic };
