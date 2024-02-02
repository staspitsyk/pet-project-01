import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LevelConfigsService } from './level-configs.service';
import { LevelConfigsAdminController } from './level-configs-admin.controller';
import { LevelConfig } from './entities/level-config.entity';
import { LevelConfigsRepository } from './level-configs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LevelConfig])],
  controllers: [LevelConfigsAdminController],
  providers: [LevelConfigsService, LevelConfigsRepository],
})
export class LevelConfigsModule {}
