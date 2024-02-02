import { Injectable } from '@nestjs/common';

import { CreateLevelConfigDto } from './dto/create-level-config.dto';
import { LevelConfigsRepository } from './level-configs.repository';
import { LevelConfigNotFoundError } from './level-configs.errors';
import { LevelConfig } from './entities/level-config.entity';

@Injectable()
export class LevelConfigsService {
  constructor(private readonly levelConfigRepository: LevelConfigsRepository) {}

  async createLevelConfig(levelConfigCandidate: CreateLevelConfigDto): Promise<number> {
    const id = await this.levelConfigRepository.createLevelConfig(levelConfigCandidate);

    return id;
  }

  getLevelConfigs() {
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
