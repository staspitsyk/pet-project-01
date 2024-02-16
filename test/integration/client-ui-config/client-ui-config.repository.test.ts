import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import configuration, { config } from 'src/config/configuration';
import { ClientUiConfigModule } from 'src/modules/client-ui-config/client-ui-config.module';
import { testMongoUri, testMongoConfig } from '../../utils/db/test_mongo_config';
import { ClientUiConfig } from 'src/modules/client-ui-config/client-ui-config.schema';
import { ClientUiConfigRepository } from 'src/modules/client-ui-config/client-ui-config.repository';
import { clientUiConfigCandidateTemplate } from './data/client-ui-config.data';

describe('ClientUiConfigRepository', () => {
  let clientUiConfigModel: Model<ClientUiConfig>;
  let clientUiConfigRepository: ClientUiConfigRepository;
  let testingModule: TestingModule;
  const clientUiConfigKey: string = config.features.clientUiConfig.key;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(testMongoUri, testMongoConfig),
        ClientUiConfigModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
      ],
    }).compile();

    clientUiConfigRepository = testingModule.get(ClientUiConfigRepository);
    clientUiConfigModel = testingModule.get(getModelToken(ClientUiConfig.name));
  });

  beforeEach(async () => {
    await Promise.all([clientUiConfigModel.deleteMany({})]);
  });

  afterAll(async () => {
    await testingModule.close();
  });

  describe('createClientUiConfig', () => {
    it('Should save client ui config', async () => {
      await clientUiConfigRepository.createClientUiConfig(clientUiConfigCandidateTemplate);

      const clientUiConfig = await clientUiConfigModel.findById(clientUiConfigKey);

      expect(clientUiConfig).toBeDefined();
      expect(clientUiConfig?._id).toEqual(clientUiConfigKey);
      expect(clientUiConfig?.name).toEqual(clientUiConfigCandidateTemplate.name);
      expect(clientUiConfig?.isFolder).toEqual(clientUiConfigCandidateTemplate.isFolder);
      expect(clientUiConfig?.type).toEqual(clientUiConfigCandidateTemplate.type);
      expect(clientUiConfig?.items).toEqual(clientUiConfigCandidateTemplate.items);
      expect(clientUiConfig?.__v).toEqual(0);
      expect(clientUiConfig?.createdAt).toEqual(expect.any(Date));
      expect(clientUiConfig?.updatedAt).toEqual(expect.any(Date));
    });

    it('Should not save client ui config if it already stored', async () => {
      const id = await clientUiConfigRepository.createClientUiConfig(clientUiConfigCandidateTemplate);

      const clientUiConfig = await clientUiConfigModel.findById(id);

      expect(clientUiConfig).toBeDefined();

      try {
        await clientUiConfigRepository.createClientUiConfig(clientUiConfigCandidateTemplate);
      } catch (err) {
        expect(err.message).toContain('duplicate key error collection');
      }

      expect.assertions(2);
    });
  });

  describe('getClientUiConfig', () => {
    it('Should return null if client ui config does not exists', async () => {
      expect(await clientUiConfigRepository.getClientUiConfig()).toBeNull();
    });

    it('Should return client ui config if exists', async () => {
      await clientUiConfigRepository.createClientUiConfig(clientUiConfigCandidateTemplate);

      const clientUiConfig = await clientUiConfigRepository.getClientUiConfig();

      expect(clientUiConfig).toBeDefined();
      expect(clientUiConfig?._id).toEqual(clientUiConfigKey);
      expect(clientUiConfig?.name).toEqual(clientUiConfigCandidateTemplate.name);
      expect(clientUiConfig?.isFolder).toEqual(clientUiConfigCandidateTemplate.isFolder);
      expect(clientUiConfig?.type).toEqual(clientUiConfigCandidateTemplate.type);
      expect(clientUiConfig?.items).toEqual(clientUiConfigCandidateTemplate.items);
      expect(clientUiConfig?.__v).toEqual(0);
      expect(clientUiConfig?.createdAt).toEqual(expect.any(Date));
      expect(clientUiConfig?.updatedAt).toEqual(expect.any(Date));
    });
  });
});
