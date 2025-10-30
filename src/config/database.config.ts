import mongoose from 'mongoose';
import { dotenvConfig } from './dotenv.config';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(dotenvConfig.MONGO_URI, {});

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Unable to connect to MongoDB:', error.message);
    } else {
      console.error('An unknown error occurred while connecting to MongoDB:', error);
    }
    process.exit(1);
  }
};

export default connectDB;
