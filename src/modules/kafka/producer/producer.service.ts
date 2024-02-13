import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly producer: Producer;

  constructor(configService: ConfigService) {
    const broker = configService.get('kafka.broker');

    const kafka = new Kafka({
      brokers: [broker],
    });

    this.producer = kafka.producer();
  }

  async send(topic, message: object, key?: string) {
    await this.producer.send({ topic, messages: [{ value: JSON.stringify(message), key }] });
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
  async onModuleInit() {
    await this.producer.connect();
  }
}
