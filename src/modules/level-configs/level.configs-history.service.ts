import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KafkaProducerService } from '../kafka/producer/producer.service';
import { HelpersDateService } from '../helpers/date/helpers.date.service';
import { LEVEL_CONFIG_HISTORY_OPERATIONS } from './types';
import { CreateLevelConfigDto } from './dto/create-level-config.dto';

@Injectable()
export class LevelConfigsHistoryService {
  private readonly topic: string;

  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly helpersDateService: HelpersDateService,
    configService: ConfigService,
  ) {
    this.topic = configService.getOrThrow('features.levelConfig.topics.levelConfigHistoryTopic');
  }

  async sendLevelConfigCreated(levelConfig: CreateLevelConfigDto & { id: number }): Promise<void> {
    await this.kafkaProducerService.send(this.topic, {
      ...levelConfig,
      timeStamp: this.helpersDateService.getCurrentUTCtimeStamp(),
      operation: LEVEL_CONFIG_HISTORY_OPERATIONS.CREATED,
    });
  }
}
