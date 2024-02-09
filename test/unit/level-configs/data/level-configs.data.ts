import { CreateLevelConfigDto } from 'src/modules/level-configs/dto/create-level-config.dto';
import { LevelConfig } from 'src/modules/level-configs/entities/level-config.entity';

export const levelConfigCandidateTemplate: CreateLevelConfigDto = { level: 1, startXp: '1000', endXp: '2000' };

export const levelConfigTemplate: LevelConfig = {
  id: 1,
  level: 1,
  startXp: '1000',
  endXp: '2000',
  createdDate: new Date(),
  updatedDate: new Date(),
};
