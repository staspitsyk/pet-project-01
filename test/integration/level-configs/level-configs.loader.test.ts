import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';

import { LevelConfig } from 'src/modules/level-configs/entities/level-config.entity';
import { LevelConfigsRepository } from 'src/modules/level-configs/level-configs.repository';
import { levelConfigCandidateTemplate } from './data/level-configs.data';
import { createdDateUpdatedDateExpect } from '../../data/date-template.data';
import { getTestModule } from '../test-module';
import { LevelConfigsLoader } from 'src/modules/level-configs/level-configs.loader';
import { REDIS_CLIENT } from 'src/modules/redis/redis-client.factory';

describe('LevelConfigsLoader', () => {
  let levelConfigRepo: Repository<LevelConfig>;
  let levelConfigsRepository: LevelConfigsRepository;
  let levelConfigsLoader: LevelConfigsLoader;
  let testingModule: TestingModule;
  let redisClient: Redis;
  let redisSetSpy: jest.SpyInstance;
  let redisGetSpy: jest.SpyInstance;
  let getLevelConfigByLevelSpy: jest.SpyInstance;

  const LEVEL_CONFIG_CACHE_KEY = 'cache:level-config';
  const LEVEL_CONFIG_CACHE_KEY_BY_LEVEL = `${LEVEL_CONFIG_CACHE_KEY}:level`;

  beforeAll(async () => {
    testingModule = await getTestModule();

    levelConfigsRepository = testingModule.get(LevelConfigsRepository);
    levelConfigRepo = testingModule.get(getRepositoryToken(LevelConfig));
    levelConfigsLoader = testingModule.get(LevelConfigsLoader);
    redisClient = testingModule.get(REDIS_CLIENT);

    redisSetSpy = jest.spyOn(redisClient, 'set');
    redisGetSpy = jest.spyOn(redisClient, 'get');
    getLevelConfigByLevelSpy = jest.spyOn(levelConfigsRepository, 'getLevelConfigByLevel');
  });

  beforeEach(async () => {
    await Promise.all([levelConfigRepo.clear(), redisClient.flushall()]);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await testingModule.close();
  });

  describe('loadLevelConfigByLevel', () => {
    it('Should return null if level config with level equals to 1 does not exists', async () => {
      expect(await levelConfigsLoader.loadLevelConfigByLevel(1)).toBeNull();
    });

    it('Should return level config with level equals to 1 if exists', async () => {
      const id = await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level: 1 });

      expect(await levelConfigsLoader.loadLevelConfigByLevel(1)).toEqual({
        ...levelConfigCandidateTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });

    it('Should store level config to redis cache', async () => {
      const level = 1;

      await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level });
      await levelConfigsLoader.loadLevelConfigByLevel(level);

      expect(redisSetSpy).toBeCalledTimes(1);
      expect(redisGetSpy).toBeCalledTimes(1);

      const levelConfigCandidate = await redisClient.get(`${LEVEL_CONFIG_CACHE_KEY_BY_LEVEL}:${level}`);

      expect(levelConfigsRepository.toLevelConfigEntity(JSON.parse(levelConfigCandidate || ''))).toEqual(
        await levelConfigsRepository.getLevelConfigByLevel(level),
      );
    });

    it('Should return level config from cache after first call', async () => {
      const level = 1;
      let levelConfig: LevelConfig | null;

      const id = await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level });
      levelConfig = await levelConfigsLoader.loadLevelConfigByLevel(level);

      expect(levelConfig).toEqual({
        ...levelConfigCandidateTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(redisSetSpy).toBeCalledTimes(1);
      expect(getLevelConfigByLevelSpy).toBeCalledTimes(1);

      levelConfig = await levelConfigsLoader.loadLevelConfigByLevel(level);

      expect(levelConfig).toEqual({
        ...levelConfigCandidateTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });

      expect(redisGetSpy).toBeCalledTimes(2);
      expect(redisSetSpy).toBeCalledTimes(1);
      expect(getLevelConfigByLevelSpy).toBeCalledTimes(1);
    });

    it('Should return level config with sequential calls', async () => {
      const level = 1;

      await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level });

      const levelConfig1 = await levelConfigsLoader.loadLevelConfigByLevel(level);
      const levelConfig2 = await levelConfigsLoader.loadLevelConfigByLevel(level);
      const levelConfig3 = await levelConfigsLoader.loadLevelConfigByLevel(level);

      expect(levelConfig1).toEqual(levelConfig2);
      expect(levelConfig2).toEqual(levelConfig3);
      expect(levelConfig3).toEqual(levelConfig1);
    });

    it('Should return level config with parallel calls', async () => {
      const level = 1;

      await levelConfigsRepository.createLevelConfig({ ...levelConfigCandidateTemplate, level });

      const [levelConfig1, levelConfig2, levelConfig3] = await Promise.all([
        levelConfigsLoader.loadLevelConfigByLevel(level),
        levelConfigsLoader.loadLevelConfigByLevel(level),
        levelConfigsLoader.loadLevelConfigByLevel(level),
      ]);

      expect(levelConfig1).toEqual(levelConfig2);
      expect(levelConfig2).toEqual(levelConfig3);
      expect(levelConfig3).toEqual(levelConfig1);
    });
  });
});
