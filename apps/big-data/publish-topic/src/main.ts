import type { Request, Response } from 'express';
import { PubSub } from '@google-cloud/pubsub';
import type { events } from '@mussia12/shared/data-types';

const pubsub = new PubSub();

// type agentLogs = 'ar' | 'as';

function publishPubSubMessage(topic: events, message: any) {
  const buffer = Buffer.from(JSON.stringify(message));
  return pubsub.topic(topic).publishMessage({ data: buffer });
}

const publishTopic = (req: Request, res: Response) => {
  const { topic } = req.body;
  delete req.body.topic;
  publishPubSubMessage(topic, req.body)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log('Failed send PubSub topic', err); // eslint-disable-line
    });
};

export { publishTopic };
