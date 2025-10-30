import dotenv from 'dotenv';

dotenv.config();

const getEnvVariable = (name: string, defaultValue = undefined) => {
  const value = process.env[name] || defaultValue;
  if (value === undefined || value.trim() === '') {
    throw new Error(`Environment variable ${name} is not set or is empty.`);
  }
  return value;
};

export const dotenvConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI: getEnvVariable('MONGO_URI'),

  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRE || '1h',

  CLOUDINARY_CLOUD_NAME: getEnvVariable('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnvVariable('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvVariable('CLOUDINARY_API_SECRET'),

  GOOGLE_CLIENT_ID: getEnvVariable('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnvVariable('GOOGLE_CLIENT_SECRET'),

  FRONTEND_URL: getEnvVariable('FRONTEND_URL'),
};

console.log('Configuration loaded successfully.');
