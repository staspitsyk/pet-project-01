import { ClientUiConfigService } from 'src/modules/client-ui-config/client-ui-config.service';
import { ClientUiConfigRepositoryMock } from '../../mocks/client-ui-config.repository.ts.mock';
import { clientUiConfigCandidateTemplate, clientUiConfigTemplate } from './data/client-ui-config.data';
import {
  ClientUiConfigAlreadyExistsError,
  ClientUiConfigNotFoundError,
} from 'src/modules/client-ui-config/client-ui-config.errors';

describe('ClientUiConfigService', () => {
  let clientUiConfigService: ClientUiConfigService;

  beforeAll(async () => {
    clientUiConfigService = new ClientUiConfigService(ClientUiConfigRepositoryMock);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('createClientUiConfig', () => {
    it('Should save client ui config', async () => {
      ClientUiConfigRepositoryMock.getClientUiConfig.mockResolvedValue(null);
      await clientUiConfigService.createClientUiConfig(clientUiConfigCandidateTemplate);

      expect(ClientUiConfigRepositoryMock.createClientUiConfig).toHaveBeenCalledWith(clientUiConfigCandidateTemplate);
    });

    it('Should not save client ui config if it already stored', async () => {
      ClientUiConfigRepositoryMock.getClientUiConfig.mockResolvedValue(clientUiConfigTemplate);

      try {
        await clientUiConfigService.createClientUiConfig(clientUiConfigCandidateTemplate);
      } catch (err) {
        expect(err).toBeInstanceOf(ClientUiConfigAlreadyExistsError);
        expect(err.message).toEqual('Client Ui config already exists');
      }

      expect.assertions(2);
    });
  });

  describe('getClientUiConfig', () => {
    it('Should throw error if client ui config does not exists', async () => {
      ClientUiConfigRepositoryMock.getClientUiConfig.mockResolvedValue(null);

      try {
        await clientUiConfigService.getClientUiConfig();
      } catch (err) {
        expect(err).toBeInstanceOf(ClientUiConfigNotFoundError);
        expect(err.message).toEqual('Client Ui config does not exist');
      }

      expect.assertions(2);
    });

    it('Should return client ui config if exists', async () => {
      ClientUiConfigRepositoryMock.getClientUiConfig.mockResolvedValue(clientUiConfigTemplate);

      const clientUiConfig = await clientUiConfigService.getClientUiConfig();

      expect(ClientUiConfigRepositoryMock.getClientUiConfig).toHaveBeenCalled();
      expect(clientUiConfig).toEqual(clientUiConfigTemplate);
    });
  });
});
