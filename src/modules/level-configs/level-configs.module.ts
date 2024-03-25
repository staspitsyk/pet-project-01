import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LevelConfigsService } from './level-configs.service';
import { LevelConfigsAdminController } from './level-configs-admin.controller';
import { LevelConfig } from './entities/level-config.entity';
import { LevelConfigsRepository } from './level-configs.repository';
import { KafkaModule } from '../kafka/kafka.module';
import { LevelConfigsHistoryService } from './level.configs-history.service';
import { RedisModule } from '../redis/redis.module';
import { LevelConfigsLoader } from './level-configs.loader';

@Module({
  imports: [TypeOrmModule.forFeature([LevelConfig]), KafkaModule, RedisModule],
  controllers: [LevelConfigsAdminController],
  providers: [LevelConfigsService, LevelConfigsRepository, LevelConfigsHistoryService, LevelConfigsLoader],
  exports: [LevelConfigsService],
})
export class LevelConfigsModule {}
