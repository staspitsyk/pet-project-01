import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/data_source';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { LevelConfigsModule } from './modules/level-configs/level-configs.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LevelConfigsModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
