import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { ReviewCreatedListener } from './events/listeners/review-created-listener';
import { ReviewUpdatedListener } from './events/listeners/review-updated-listener';
import { ReviewDeletedListener } from './events/listeners/review-deleted-listener';

const startInstance = async () => {
  // if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('invalid MONGO_URI');
  if (!process.env.NATS_CLIENT_ID) throw new Error('invalid client ID!');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('invalid client ID!');
  if (!process.env.NATS_URL) throw new Error('invalid client ID!');

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', function () {
      console.log('closed !');
      process.exit();
    });
    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ReviewCreatedListener(natsWrapper.client).listen();
    // review updated
    new ReviewUpdatedListener(natsWrapper.client).listen();
    // review deleted
    new ReviewDeletedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to database!!');
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!');
  });
};
startInstance();
