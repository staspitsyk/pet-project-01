import { configDotenv } from 'dotenv';

import { validationSchema } from './validation';

configDotenv();

type Config = {
  database: {
    postgres: {
      type: 'postgres';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };
  };
  app: {
    port: number;
  };
};

export const config: Config = {
  database: {
    postgres: {
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT || '5432'),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
    },
  },
  app: {
    port: parseInt(process.env.APP_PORT || '3000'),
  },
} as Config;

export default (): Config => {
  const { error } = validationSchema.validate(config);

  if (error) {
    throw error;
  }

  return config;
};
