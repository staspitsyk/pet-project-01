import { getModelToken } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { Model } from 'mongoose';
import * as request from 'supertest';

import { ClientUiConfigRepository } from 'src/modules/client-ui-config/client-ui-config.repository';
import { ClientUiConfig } from 'src/modules/client-ui-config/client-ui-config.schema';
import { ClientUiConfig as ClientUiConfigResponse } from 'src/graphql/graphql.schema';
import { getTestApplication } from '../test-application';
import { clientUiConfigQuery } from './graphql/clientUiConfigQuery';
import { clientUiConfigCandidateTemplate } from './data/client-ui-config.data';
import { ClientUiConfigCandidate } from 'src/modules/client-ui-config/types';
import { cloneDeep } from 'lodash';
import { createClientUiConfigMutation } from './graphql/createClientUiConfigMutation';

describe('Client UI Config GraphQL Admin API', () => {
  let clientUiConfigModel: Model<ClientUiConfig>;
  let clientUiConfigRepository: ClientUiConfigRepository;
  let app: INestApplication;
  let httpServer: any;
  const GQL_URL = '/graphql';

  beforeAll(async () => {
    app = await getTestApplication();

    clientUiConfigModel = app.get(getModelToken(ClientUiConfig.name));
    clientUiConfigRepository = app.get(ClientUiConfigRepository);
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await Promise.all([clientUiConfigModel.deleteMany({})]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('clientUiConfig Query', () => {
    it('Should response with status code 404 and data equals to null if config is not stored', async () => {
      const res = await request(httpServer).post(GQL_URL).send(clientUiConfigQuery());

      const error = res.body?.errors?.[0];

      expect(error.message).toEqual('Client Ui config does not exist');
      expect(error.statusCode).toEqual(404);
      expect(res.body.data.clientUiConfig).toBeNull();
    });

    it('Should response with data equals to client ui config if config is not stored', async () => {
      await clientUiConfigRepository.createClientUiConfig(clientUiConfigCandidateTemplate);

      const res = await request(httpServer).post(GQL_URL).send(clientUiConfigQuery());

      const extendClientUiConfigResponse = (candidate: ClientUiConfigCandidate): ClientUiConfigResponse => {
        const candidateCopy = cloneDeep(candidate);

        const recursivelyExtend = (candidate: ClientUiConfigResponse) => {
          if (candidate.isFolder) {
            candidate.description = 'Current config is a folder level, fetch items to get full config';
            candidate?.items?.forEach((candidate) => recursivelyExtend(candidate as unknown as ClientUiConfigResponse));
          } else {
            candidate.description = 'Current config is a final one in a tree';
          }
        };

        recursivelyExtend(candidateCopy);

        return candidateCopy;
      };

      const clientUiConfigResponse = extendClientUiConfigResponse(clientUiConfigCandidateTemplate);

      expect(res.body.data.clientUiConfig).toEqual(clientUiConfigResponse);
    });
  });

  describe('createClientUiConfig Mutation', () => {
    it('Should create client ui config', async () => {
      expect(await clientUiConfigRepository.getClientUiConfig()).toBeNull();

      const res = await request(httpServer).post(GQL_URL).send(createClientUiConfigMutation());

      expect(res.body.data).toEqual({ createClientUiConfig: { isFolder: true, name: '1', type: 'DROP_DOWN' } });
      expect(await clientUiConfigRepository.getClientUiConfig()).toBeDefined();
    });

    it('Should response with status code 400 if config already stored', async () => {
      await request(httpServer).post(GQL_URL).send(createClientUiConfigMutation());
      expect(await clientUiConfigRepository.getClientUiConfig()).toBeDefined();
      const res = await request(httpServer).post(GQL_URL).send(createClientUiConfigMutation());

      const error = res.body?.errors?.[0];

      expect(error.message).toEqual('Client Ui config already exists');
      expect(error.statusCode).toEqual(400);
      expect(res.body.data).toBeNull();
    });
  });
});
