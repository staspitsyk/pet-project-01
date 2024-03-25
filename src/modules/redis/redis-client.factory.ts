import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const redisClientFactory: FactoryProvider<Promise<Redis>> = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const redis = new Redis({
      host: configService.getOrThrow<string>('database.redis.host'),
      port: configService.getOrThrow<number>('database.redis.port'),
    });

    return redis;
  },
  inject: [ConfigService],
};
