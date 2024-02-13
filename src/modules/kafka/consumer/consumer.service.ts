import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopic, Kafka } from 'kafkajs';

import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];
  private readonly logger: Logger;

  constructor(configService: ConfigService, readonly loggerService: LoggerService) {
    const broker = configService.get('kafka.broker');

    this.kafka = new Kafka({
      brokers: [broker],
    });
    this.logger = loggerService.getLogger('KafkaConsumerService');
  }

  async consume(groupId: string, topic: ConsumerSubscribeTopic, config: ConsumerRunConfig) {
    const consumer: Consumer = this.kafka.consumer({ groupId: groupId });
    await consumer.connect().catch((error) => this.logger.error(error));
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
