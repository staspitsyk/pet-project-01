import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ClientUiConfig } from './client-ui-config.schema';
import { ClientUiConfigCandidate } from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientUiConfigRepository {
  private readonly configKey: string;

  constructor(
    @InjectModel(ClientUiConfig.name) private clientUiConfigModel: Model<ClientUiConfig>,
    configService: ConfigService,
  ) {
    this.configKey = configService.getOrThrow('features.clientUiConfig.key');
  }

  async createClientUiConfig(clientUiConfigCandidate: ClientUiConfigCandidate): Promise<string> {
    const newClientUiConfig = new this.clientUiConfigModel({ ...clientUiConfigCandidate, _id: this.configKey });

    const savedClientUiConfig = await newClientUiConfig.save();

    return savedClientUiConfig._id;
  }

  getClientUiConfig(): Promise<ClientUiConfig | null> {
    return this.clientUiConfigModel.findById(this.configKey);
  }
}
