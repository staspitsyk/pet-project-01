import { Injectable } from '@nestjs/common';

import { ClientUiConfigRepository } from './client-ui-config.repository';
import { ClientUiConfig } from './client-ui-config.schema';
import { ClientUiConfigCandidate } from './types';
import { ClientUiConfigAlreadyExistsError, ClientUiConfigNotFoundError } from './client-ui-config.errors';

const FETCH_NEXT_NODE_DESCRIPTION = 'Current config is a folder level, fetch items to get full config';
const FINAL_NODE_DESCRIPTION = 'Current config is a final one in a tree';

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

  getConfigDescription(config: ClientUiConfig): string {
    if (config.isFolder) {
      return FETCH_NEXT_NODE_DESCRIPTION;
    } else {
      return FINAL_NODE_DESCRIPTION;
    }
  }
}
