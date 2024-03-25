import { configDotenv } from 'dotenv';
import { merge } from 'lodash';

import { validationSchema } from './validation';
import { Environment } from 'src/constants/environment';

configDotenv();

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type Config = {
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
    mongo: {
      dbName: string;
      username: string;
      password: string;
      uri: string;
    };
    redis: {
      host: string;
      port: number;
    };
  };
  kafka: {
    broker: string;
  };
  app: {
    port: number;
  };
  features: {
    levelConfig: {
      topics: {
        levelConfigHistoryTopic: string;
      };
    };
    clientUiConfig: {
      key: string;
    };
  };
  auth: {
    jwt: {
      secret: string;
      expiresInS: number;
    };
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
    mongo: {
      dbName: process.env.MONGO_NAME,
      username: process.env.MONGO_USER,
      password: process.env.MONGO_USER,
      uri: process.env.MONGO_URI,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  },
  kafka: {
    broker: process.env.KAFKA_BROKER,
  },
  features: {
    levelConfig: {
      topics: {
        levelConfigHistoryTopic: 'level-config-history',
      },
    },
    clientUiConfig: {
      key: 'client-ui-config-key',
    },
  },
  app: {
    port: parseInt(process.env.APP_PORT || '3000'),
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresInS: 60 * 60 * 24,
    },
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
