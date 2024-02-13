import { Consumer, Kafka } from 'kafkajs';

import { config } from 'src/config/configuration';

export type TopicToMessagesMap = { [topic: string]: any[] };

export const getTestKafkaConsumer = async (): Promise<Consumer> => {
  const kafkaClient = new Kafka({ brokers: [config.kafka.broker] });

  const consumer = kafkaClient.consumer({ groupId: 'test-group-id' });

  await consumer.connect();

  return consumer;
};

export const consumeMessages = async (consumer: Consumer, topics: string[]): Promise<TopicToMessagesMap> => {
  await consumer.subscribe({ topics });

  const topicToMessagesMap: TopicToMessagesMap = {};

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const messageData = JSON.parse(message?.value?.toString() || '');

      if (topicToMessagesMap[topic]) {
        topicToMessagesMap[topic].push(messageData);
      } else {
        topicToMessagesMap[topic] = [messageData];
      }
    },
  });

  return topicToMessagesMap;
};
