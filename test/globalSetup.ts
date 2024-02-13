import { upAll } from 'docker-compose';
import { Kafka } from 'kafkajs';
import { join } from 'path';

export default async () => {
  await upAll({
    cwd: join(__dirname),
    log: true,
  });

  const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || ''] });

  const admin = kafka.admin();

  await admin.connect();
  await admin.disconnect();
};
