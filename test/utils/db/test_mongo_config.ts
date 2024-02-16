import { MongooseModuleOptions } from '@nestjs/mongoose';

export const testMongoUri = 'mongodb://localhost:27017';

export const testMongoConfig: MongooseModuleOptions = {
  dbName: 'mongo-test',
  auth: { username: 'mongoadmin', password: 'mongoadmin' },
};
