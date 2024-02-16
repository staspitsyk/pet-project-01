import { Injectable } from '@nestjs/common';

import { ClientUiConfigRepository } from './client-ui-config.repository';
import { ClientUiConfig } from './client-ui-config.schema';
import { ClientUiConfigCandidate } from './types';
import { ClientUiConfigAlreadyExistsError, ClientUiConfigNotFoundError } from './client-ui-config.errors';

@Injectable()
export class ClientUiConfigService {
  constructor(private readonly clientUiConfigRepository: ClientUiConfigRepository) {}

  async createClientUiConfig(clientUiConfigCandidate: ClientUiConfigCandidate): Promise<string> {
    const clientUiConfig = await this.clientUiConfigRepository.getClientUiConfig();

    if (clientUiConfig) {
      throw new ClientUiConfigAlreadyExistsError();
    }

    return this.clientUiConfigRepository.createClientUiConfig(clientUiConfigCandidate);
  }

  async getClientUiConfig(): Promise<ClientUiConfig> {
    const clientUiConfig = await this.clientUiConfigRepository.getClientUiConfig();

    if (!clientUiConfig) {
      throw new ClientUiConfigNotFoundError();
    }

    return clientUiConfig;
  }
}
