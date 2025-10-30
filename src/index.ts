import app from './app';
import connectDB from './config/database.config';
import { dotenvConfig } from './config/dotenv.config';

const PORT = dotenvConfig.PORT;

const start = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Unable to connect to the database:', error.message);
    } else {
      console.error(
        'An unknown error occurred while connecting to the database or app listening:',
        error,
      );
    }
  }
};

start();
