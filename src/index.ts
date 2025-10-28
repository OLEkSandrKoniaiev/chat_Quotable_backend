import dotenv from 'dotenv';
import app from './app.ts';

dotenv.config();
const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  try {
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
