import { levelConfigCandidateTemplate, levelConfigTemplate } from './data/level-configs.data';
import { LevelConfigsService } from 'src/modules/level-configs/level-configs.service';
import { LevelConfigsRepositoryMock } from '../../mocks/level-configs.repository.mock';
import { LoggerService } from 'src/modules/logger/logger.service';
import { LevelConfigNotFoundError } from 'src/modules/level-configs/level-configs.errors';
import { LevelConfigsHistoryServiceMock } from '../../mocks/level.configs-history.service.mock';
import { LevelConfigsLoaderMock } from 'test/mocks/level-configs.loader.mock';

describe('LevelConfigsService', () => {
  let levelConfigsService: LevelConfigsService;

  beforeAll(async () => {
    levelConfigsService = new LevelConfigsService(
      LevelConfigsRepositoryMock,
      new LoggerService(),
      LevelConfigsHistoryServiceMock,
      LevelConfigsLoaderMock,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('createLevelConfig', () => {
    it('Should call levelConfigsRepository.createLevelConfig with expected arguments', async () => {
      await levelConfigsService.createLevelConfig(levelConfigCandidateTemplate);

      expect(LevelConfigsRepositoryMock.createLevelConfig).toHaveBeenCalledWith(levelConfigCandidateTemplate);
    });

    it('Should call levelConfigsHistoryService.sendLevelConfigCreated with expected arguments', async () => {
      const id = 1;
      LevelConfigsRepositoryMock.createLevelConfig.mockResolvedValue(id);

      await levelConfigsService.createLevelConfig(levelConfigCandidateTemplate);

      expect(LevelConfigsHistoryServiceMock.sendLevelConfigCreated).toHaveBeenCalledWith({
        ...levelConfigCandidateTemplate,
        id,
      });
    });
  });

  describe('getLevelConfigByLevel', () => {
    it('Should return level config if exists', async () => {
      LevelConfigsLoaderMock.loadLevelConfigByLevel.mockResolvedValue(levelConfigTemplate);

      const levelConfig = await levelConfigsService.createLevelConfig(levelConfigCandidateTemplate);

      expect(levelConfig).toEqual(levelConfig);
    });

    it('Should throw error if level config does not exist', async () => {
      try {
        LevelConfigsLoaderMock.loadLevelConfigByLevel.mockResolvedValue(null);

        await levelConfigsService.getLevelConfigByLevel(1);
      } catch (err) {
        expect(err).toBeInstanceOf(LevelConfigNotFoundError);
        expect(err.message).toEqual('Level config does not exist with level equals to 1');
      }
    });
  });

  describe('getLiveLevelConfigByLevel', () => {
    it('Should return level config if exists', async () => {
      LevelConfigsRepositoryMock.getLevelConfigByLevel.mockResolvedValue(levelConfigTemplate);

      const levelConfig = await levelConfigsService.createLevelConfig(levelConfigCandidateTemplate);

      expect(levelConfig).toEqual(levelConfig);
    });

    it('Should throw error if level config does not exist', async () => {
      try {
        LevelConfigsRepositoryMock.getLevelConfigByLevel.mockResolvedValue(null);

        await levelConfigsService.getLevelConfigByLevel(1);
      } catch (err) {
        expect(err).toBeInstanceOf(LevelConfigNotFoundError);
        expect(err.message).toEqual('Level config does not exist with level equals to 1');
      }
    });
  });

  describe('getLevelConfigs', () => {
    it('Should call levelConfigsRepository.getLevelConfigs', async () => {
      await levelConfigsService.getLevelConfigs();

      expect(LevelConfigsRepositoryMock.getLevelConfigs).toHaveBeenCalled();
    });
  });
});
