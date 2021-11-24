import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const startInstance = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('invalid MONGO_URI');
  if (!process.env.NATS_CLIENT_ID) throw new Error('invalid client ID!');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('invalid cluster ID!');
  if (!process.env.NATS_URL) throw new Error('invalid nats urlID!');

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
    // post deleted listener

    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to database');
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
};
startInstance();
