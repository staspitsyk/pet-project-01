import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/data_source';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLFormattedError } from 'graphql';

import configuration from './config/configuration';
import { LevelConfigsModule } from './modules/level-configs/level-configs.module';
import { LoggerModule } from './modules/logger/logger.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { HelpersModule } from './modules/helpers/helpers.module';
import { mongoConfig, mongoUri } from './db/mongo_config';
import { ClientUiConfigModule } from './modules/client-ui-config/client-ui-config.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql.schema.ts'),
      },
      formatError: (err) => (err.extensions?.originalError || err) as GraphQLFormattedError,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    KafkaModule,
    MongooseModule.forRoot(mongoUri, mongoConfig),
    RedisModule,
    LoggerModule,
    HelpersModule,
    AuthModule,
    LevelConfigsModule,
    ClientUiConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
