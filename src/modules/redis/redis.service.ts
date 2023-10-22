import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType, SetOptions } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  public async set(key: string, value: any, ttl?: number): Promise<any> {
    if (!ttl) {
      await this.redisClient.set(key, value);
    } else {
      await this.redisClient.set(key, value, ttl as SetOptions);
    }
  }

  public async get(key: string): Promise<any> {
    return await this.redisClient.get(key);
  }
  public async del(key: string): Promise<any> {
    return await this.redisClient.del(key);
  }

  /**
   * @Description: 清空redis的缓存
   * @param {type}
   * @return:
   */
  public async flushAll(): Promise<any> {
    return await this.redisClient.flushAll();
  }
}
