import { MongooseModuleOptions } from '@nestjs/mongoose';

import { config } from '../config/configuration';

export const mongoUri = config.database.mongo.uri;

export const mongoConfig: MongooseModuleOptions = {
  dbName: config.database.mongo.dbName,
  auth: { username: config.database.mongo.username, password: config.database.mongo.password },
};
