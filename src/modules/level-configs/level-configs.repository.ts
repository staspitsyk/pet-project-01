import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LevelConfig } from './entities/level-config.entity';
import { CreateLevelConfigDto } from './dto/create-level-config.dto';

@Injectable()
export class LevelConfigsRepository {
  constructor(
    @InjectRepository(LevelConfig)
    private levelConfigsRepo: Repository<LevelConfig>,
  ) {}

  toLevelConfigEntity(levelConfigCandidate: LevelConfig): LevelConfig {
    const { createdDate, updatedDate } = levelConfigCandidate;

    const entity = this.levelConfigsRepo.create({
      ...levelConfigCandidate,
      createdDate: new Date(createdDate),
      updatedDate: new Date(updatedDate),
    });

    return entity;
  }

  async createLevelConfig(levelConfigCandidate: CreateLevelConfigDto): Promise<number> {
    const levelConfig = this.levelConfigsRepo.create(levelConfigCandidate);

    const newLevelConfig = await this.levelConfigsRepo.save(levelConfig);

    return newLevelConfig.id;
  }

  async getLevelConfigs(): Promise<LevelConfig[]> {
    const levelConfigs = await this.levelConfigsRepo.find();

    return levelConfigs;
  }

  async getLevelConfigByLevel(level: number): Promise<LevelConfig | null> {
    const levelConfig = await this.levelConfigsRepo.findOneBy({ level });

    return levelConfig;
  }

  async getLevelConfigById(id: number): Promise<LevelConfig | null> {
    const levelConfig = await this.levelConfigsRepo.findOneBy({ id });

    return levelConfig;
  }
}
