import mongoose from 'mongoose';
// import { Storage } from '@google-cloud/storage';
import Pusher from 'pusher';
import { Event1Schema, Event1 } from '@mussia12/shared/mongoose-schemas';
// const storage = new Storage();

const Model = mongoose.model(Event1.name, Event1Schema);

async function dbConnect() {
  return mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost/mussia12',
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }
  );
}

const event1Subscription = (event: any) => {
  dbConnect()
    .then(() => {
      const message = event.data
        ? Buffer.from(event.data, 'base64').toString()
        : '';

      console.log('message', message); // eslint-disable-line

      const newEvent = new Model(JSON.parse(message));

      newEvent
        .save()
        .then((item) => {
          console.log('Added new item: ', item); // eslint-disable-line
          const pusher = new Pusher({
            appId: '1253889',
            key: 'd7880526d3965e004014',
            secret: '340b5283bedf5bc81888',
            cluster: 'eu',
            useTLS: true,
          });

          pusher.trigger('my-channel', 'event1-added', {
            logId: item._id,
          });
        })
        .catch((err) => {
          console.log('Error saving new event', err);
        });
    })
    .catch((err) => {
      console.log('err', err);
    });
};

export { event1Subscription };
