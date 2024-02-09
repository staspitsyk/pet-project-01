import { configDotenv } from 'dotenv';
import { merge } from 'lodash';

import { validationSchema } from './validation';
import { Environment } from 'src/constants/environment';

configDotenv();

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Config = {
  database: {
    postgres: {
      type: 'postgres';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
      entities: string[];
    };
  };
  app: {
    port: number;
  };
};

const baseConfig: RecursivePartial<Config> = {
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
};

const testConfig: RecursivePartial<Config> = {
  database: {
    postgres: {
      synchronize: true,
      entities: ['src/**/*.entity.ts'],
    },
  },
};

const devConfig: RecursivePartial<Config> = {
  database: {
    postgres: {
      synchronize: false,
      entities: ['dist/**/*.entity.js'],
    },
  },
};

const getConfigByEnv = (): Config => {
  if (process.env.NODE_ENV === Environment.TEST) {
    return merge({}, baseConfig, testConfig) as Config;
  }

  return merge({}, baseConfig, devConfig) as Config;
};

export const config = getConfigByEnv();

export default (): Config => {
  const config = getConfigByEnv();

  const { error } = validationSchema.validate(config);

  if (error) {
    throw error;
  }

  return config;
};
