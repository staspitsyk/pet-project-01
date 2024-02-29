import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from 'src/config/configuration';
import { ClientUiConfigModule } from 'src/modules/client-ui-config/client-ui-config.module';
import { HelpersModule } from 'src/modules/helpers/helpers.module';
import { KafkaModule } from 'src/modules/kafka/kafka.module';
import { LevelConfigsModule } from 'src/modules/level-configs/level-configs.module';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { UsersModule } from 'src/modules/users/users.module';
import { testDataSourceOptions } from 'test/utils/db/test_data_source';
import { testMongoConfig, testMongoUri } from 'test/utils/db/test_mongo_config';

export const getTestModule = async (): Promise<TestingModule> => {
  const testingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(testMongoUri, testMongoConfig),
      ClientUiConfigModule,
      TypeOrmModule.forRoot(testDataSourceOptions),
      LoggerModule,
      HelpersModule,
      LevelConfigsModule,
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
      }),
      KafkaModule,
      UsersModule,
    ],
  }).compile();

  return testingModule;
};
