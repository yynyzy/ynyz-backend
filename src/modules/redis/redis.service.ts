import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async setValue(key: string, value: string) {
    return await this.redisClient.set(key, value);
  }

  async getValue(key: string) {
    return await this.redisClient.get(key);
  }

  async delValue(key: string) {
    return await this.redisClient.del(key);
  }
}
