import { Injectable, Logger } from '@nestjs/common';

import { CreateLevelConfigDto } from './dto/create-level-config.dto';
import { LevelConfigsRepository } from './level-configs.repository';
import { LevelConfigNotFoundError } from './level-configs.errors';
import { LevelConfig } from './entities/level-config.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LevelConfigsService {
  private readonly logger: Logger;

  constructor(private readonly levelConfigRepository: LevelConfigsRepository, readonly loggerService: LoggerService) {
    this.logger = loggerService.getLogger('LevelConfigsService');
  }

  async createLevelConfig(levelConfigCandidate: CreateLevelConfigDto): Promise<number> {
    const id = await this.levelConfigRepository.createLevelConfig(levelConfigCandidate);

    return id;
  }

  getLevelConfigs() {
    this.logger.log('Get Level Configs');

    return this.levelConfigRepository.getLevelConfigs();
  }

  async getLevelConfigByLevel(level: number): Promise<LevelConfig> {
    const levelConfig = await this.levelConfigRepository.getLevelConfigByLevel(level);

    if (!levelConfig) {
      throw new LevelConfigNotFoundError({ level });
    }

    return levelConfig;
  }
}
