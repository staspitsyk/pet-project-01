import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import waitForExpect from 'wait-for-expect';

import { LevelConfig } from 'src/modules/level-configs/entities/level-config.entity';
import { getTestApplication } from '../test-application';
import { levelConfigCandidateTemplate } from './data/level-configs.data';
import { LevelConfigsRepository } from 'src/modules/level-configs/level-configs.repository';
import { createdDateUpdatedDateExpect, createdDateUpdatedDateResponseExpect } from '../../data/date-template.data';
import { LEVEL_CONFIGS_ROUTE } from 'src/modules/level-configs/routes';
import { TopicToMessagesMap, consumeMessages, getTestKafkaConsumer } from '../../utils/kafka/test-kafka';
import { LEVEL_CONFIG_HISTORY_OPERATIONS } from 'src/modules/level-configs/types';

describe('Level Configs REST Admin API', () => {
  let levelConfigRepo: Repository<LevelConfig>;
  let levelConfigsRepository: LevelConfigsRepository;
  let app: INestApplication;
  let httpServer: any;
  let kafkaConsumer: Consumer;
  let topicToMessagesMap: TopicToMessagesMap;
  let levelConfigHistoryTopic: string;

  beforeAll(async () => {
    app = await getTestApplication();

    levelConfigRepo = app.get(getRepositoryToken(LevelConfig));
    levelConfigsRepository = app.get(LevelConfigsRepository);
    httpServer = app.getHttpServer();

    const configService = app.get(ConfigService);

    levelConfigHistoryTopic = configService.getOrThrow('features.levelConfig.topics.levelConfigHistoryTopic');

    kafkaConsumer = await getTestKafkaConsumer();

    topicToMessagesMap = await consumeMessages(kafkaConsumer, [levelConfigHistoryTopic]);
  });

  beforeEach(async () => {
    await Promise.all([levelConfigRepo.clear()]);
  });

  afterAll(async () => {
    await app.close();
    await kafkaConsumer.disconnect();
  });

  describe('POST (/admin/level-configs)', () => {
    it('Should response with status 400 and do not save level config with invalid data types', async () => {
      const invalidNumberString = 'some-string';
      const invalidNumber = '123';
      const res = await request(httpServer).post(LEVEL_CONFIGS_ROUTE).send({
        level: invalidNumber,
        startXp: invalidNumberString,
        endXp: invalidNumberString,
      });

      expect(res.body.message).toContain('level must be a positive number');
      expect(res.body.message).toContain('level must be a number conforming to the specified constraints');
      expect(res.body.message).toContain('startXp must be a number string');
      expect(res.body.message).toContain('endXp must be a number string');
    });

    it('Should response with status 400 and do not save level config if mandatory properties are missed', async () => {
      const res = await request(httpServer).post(LEVEL_CONFIGS_ROUTE).send({});

      expect(res.status).toEqual(400);
      expect(res.body.message).toContain('level should not be empty');
      expect(res.body.message).toContain('startXp should not be empty');
      expect(res.body.message).toContain('endXp should not be empty');
    });

    it('Should response with status 201 and save level config', async () => {
      const res = await request(httpServer).post(LEVEL_CONFIGS_ROUTE).send(levelConfigCandidateTemplate);

      const {
        body: { id },
      } = res;

      const levelConfig = await levelConfigsRepository.getLevelConfigById(id);

      expect(res.status).toEqual(201);
      expect(levelConfig).toEqual({
        ...levelConfigCandidateTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });

    it('Should response with status 500 and do not save if level is not unique', async () => {
      await request(httpServer).post(LEVEL_CONFIGS_ROUTE).send(levelConfigCandidateTemplate);
      const res = await request(httpServer).post(LEVEL_CONFIGS_ROUTE).send(levelConfigCandidateTemplate);

      const levelConfigs = await levelConfigsRepository.getLevelConfigs();

      expect(res.status).toEqual(500);
      expect(res.body.message).toEqual('Oops, something went wrong');
      expect(levelConfigs).toHaveLength(1);
    });

    it('Should send history message to kafka', async () => {
      const {
        body: { id },
      } = await request(httpServer).post(LEVEL_CONFIGS_ROUTE).send(levelConfigCandidateTemplate);

      await waitForExpect(() => {
        const levelConfigHistoryMessages = topicToMessagesMap[levelConfigHistoryTopic];
        const message = levelConfigHistoryMessages.find((message) => message.id === id);

        expect(message).toBeDefined();
        expect(message).toEqual({
          ...levelConfigCandidateTemplate,
          id,
          timeStamp: expect.any(Number),
          operation: LEVEL_CONFIG_HISTORY_OPERATIONS.CREATED,
        });
      });
    });
  });

  describe('GET (/admin/level-configs)', () => {
    it('Should response with status 200 and return empty array if no level configs stored', async () => {
      const res = await request(httpServer).get(LEVEL_CONFIGS_ROUTE);

      const {
        body: { levelConfigs },
      } = res;

      expect(res.status).toEqual(200);
      expect(levelConfigs).toEqual([]);
    });

    it('Should response with status 200 and return level configs if stored', async () => {
      await request(httpServer)
        .post(LEVEL_CONFIGS_ROUTE)
        .send({ ...levelConfigCandidateTemplate, level: 1 });
      await request(httpServer)
        .post(LEVEL_CONFIGS_ROUTE)
        .send({ ...levelConfigCandidateTemplate, level: 2 });
      await request(httpServer)
        .post(LEVEL_CONFIGS_ROUTE)
        .send({ ...levelConfigCandidateTemplate, level: 3 });

      const res = await request(httpServer).get(LEVEL_CONFIGS_ROUTE);

      const {
        body: { levelConfigs },
      } = res;

      expect(res.status).toEqual(200);
      expect(levelConfigs).toHaveLength(3);
    });
  });

  describe('GET (/admin/level-configs/level/:level)', () => {
    it('Should response with status 404 if level config with provided level is not stored', async () => {
      const res = await request(httpServer).get(`${LEVEL_CONFIGS_ROUTE}/level/1`);

      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual(`Level config does not exist with level equals to 1`);
    });

    it('Should response with status 200 and return level config if stored', async () => {
      const {
        body: { id },
      } = await request(httpServer)
        .post(LEVEL_CONFIGS_ROUTE)
        .send({ ...levelConfigCandidateTemplate, level: 1 });

      const res = await request(httpServer).get(`${LEVEL_CONFIGS_ROUTE}/level/1`);

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        ...levelConfigCandidateTemplate,
        id,
        ...createdDateUpdatedDateResponseExpect,
      });
    });
  });
});
