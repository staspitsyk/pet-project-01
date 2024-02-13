import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KafkaConsumerService } from './consumer/consumer.service';
import { KafkaProducerService } from './producer/producer.service';

@Module({
  imports: [ConfigModule],
  providers: [KafkaConsumerService, KafkaProducerService],
  exports: [KafkaConsumerService, KafkaProducerService],
})
export class KafkaModule {}
