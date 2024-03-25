import { Injectable } from '@nestjs/common';

import { LevelConfig } from './entities/level-config.entity';
import { RedisService } from '../redis/redis.service';
import { LevelConfigsRepository } from './level-configs.repository';
import { MsIn } from 'src/constants/date';

const LEVEL_CONFIG_CACHE_KEY = 'cache:level-config';
const LEVEL_CONFIG_CACHE_KEY_BY_LEVEL = `${LEVEL_CONFIG_CACHE_KEY}:level`;
const LEVEL_CONFIG_TTL_MS = MsIn.DAY;

@Injectable()
export class LevelConfigsLoader {
  constructor(
    private readonly levelConfigRepository: LevelConfigsRepository,
    private readonly redisService: RedisService,
  ) {}

  async loadLevelConfigByLevel(level: number): Promise<LevelConfig | null> {
    const levelConfigCandidate = await this.redisService.redis.get(`${LEVEL_CONFIG_CACHE_KEY_BY_LEVEL}:${level}`);

    if (!levelConfigCandidate) {
      const levelConfig = await this.levelConfigRepository.getLevelConfigByLevel(level);

      if (!levelConfig) {
        return null;
      }

      await this.redisService.redis.set(
        `${LEVEL_CONFIG_CACHE_KEY_BY_LEVEL}:${level}`,
        JSON.stringify(levelConfig),
        'PX',
        LEVEL_CONFIG_TTL_MS,
      );

      return levelConfig;
    }

    return this.levelConfigRepository.toLevelConfigEntity(JSON.parse(levelConfigCandidate));
  }
}
