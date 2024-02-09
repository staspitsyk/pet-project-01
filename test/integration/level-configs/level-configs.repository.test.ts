import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LevelConfig } from 'src/modules/level-configs/entities/level-config.entity';
import { LevelConfigsModule } from 'src/modules/level-configs/level-configs.module';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { testDataSourceOptions } from '../db/test_data_source';
import { LevelConfigsRepository } from 'src/modules/level-configs/level-configs.repository';
import { levelConfigCandidateTemplate } from './data/level-configs.data';
import { createdDateUpdatedDateExpect } from '../../data/date-template.data';

describe('LevelConfigsRepository', () => {
  let levelConfigRepo: Repository<LevelConfig>;
  let levelConfigsRepository: LevelConfigsRepository;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testDataSourceOptions), LoggerModule, LevelConfigsModule],
    }).compile();

    levelConfigsRepository = testingModule.get(LevelConfigsRepository);
    levelConfigRepo = testingModule.get(getRepositoryToken(LevelConfig));
  });

  beforeEach(async () => {
    await Promise.all([levelConfigRepo.clear()]);
  });

  describe('createLevelConfig', () => {
    it('Should save level config', async () => {
      const id = await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);

      expect(await levelConfigRepo.findOneBy({ id })).toEqual({
        ...levelConfigCandidateTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });

    it('Should save level config with sequential calls', async () => {
      const id1 = await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 1 });
      const id2 = await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 2 });

      expect(await levelConfigRepo.findOneBy({ id: id1 })).toBeDefined();
      expect(await levelConfigRepo.findOneBy({ id: id2 })).toBeDefined();
    });

    it('Should save level config with parallel calls', async () => {
      const [id1, id2] = await Promise.all([
        levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 1 }),
        levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 2 }),
      ]);

      expect(await levelConfigRepo.findOneBy({ id: id1 })).toBeDefined();
      expect(await levelConfigRepo.findOneBy({ id: id2 })).toBeDefined();
    });

    it('Should throw error if level is not unique', async () => {
      try {
        await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 1 });
        await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 1 });
      } catch (err) {
        expect(err.message).toContain('duplicate key value violates unique constraint');
      }

      expect.assertions(1);
    });
  });

  describe('getLevelConfigByLevel', () => {
    it('Should return null if level config with level equals to 1 does not exists', async () => {
      expect(await levelConfigsRepository.getLevelConfigByLevel(1)).toBeNull();
    });

    it('Should return level config with level equals to 1 if exists', async () => {
      const id = await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 1 });

      expect(await levelConfigsRepository.getLevelConfigByLevel(1)).toEqual({
        ...levelConfigCandidateTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });
  });

  describe('getLevelConfigs', () => {
    it('Should return [] if no levelConfigs are stored', async () => {
      expect(await levelConfigsRepository.getLevelConfigs()).toEqual([]);
    });

    it('Should return level configs if exist', async () => {
      await Promise.all([
        levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 1 }),
        levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 2 }),
        levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 3 }),
      ]);

      expect(await levelConfigsRepository.getLevelConfigs()).toHaveLength(3);
    });
  });
});
