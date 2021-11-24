import { app } from './app';
import mongoose from 'mongoose';
const startInstance = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('invalid MONGO_URI');
  try {
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
