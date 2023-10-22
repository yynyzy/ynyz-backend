import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType, SetOptions } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async set(key: string, value: any, ttl?: number) {
    return await this.redisClient.set(key, value, ttl as SetOptions);
  }
  async get(key: string) {
    return await this.redisClient.get(key);
  }
  async del(key: string) {
    return await this.redisClient.del(key);
  }
}
