import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from './redis-client.factory';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(@Inject(REDIS_CLIENT) readonly redis: Redis) {}

  onModuleDestroy() {
    this.redis.quit();
  }
}
