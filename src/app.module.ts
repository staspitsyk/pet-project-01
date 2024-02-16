import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/data_source';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/configuration';
import { LevelConfigsModule } from './modules/level-configs/level-configs.module';
import { LoggerModule } from './modules/logger/logger.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { HelpersModule } from './modules/helpers/helpers.module';
import { mongoConfig, mongoUri } from './db/mongo_config';
import { ClientUiConfigModule } from './modules/client-ui-config/client-ui-config.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LevelConfigsModule,
    LoggerModule,
    HelpersModule,
    KafkaModule,
    MongooseModule.forRoot(mongoUri, mongoConfig),
    ClientUiConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
