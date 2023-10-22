import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import type { Request } from 'express';
import { AuthConstant } from './constant/auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
      passReqToCallback: true, // 将请求传递给下面的 validate 函数，validate()函数接受的第一个参数就是req: Request
    } as StrategyOptions);
  }

  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const { id } = payload;
    // 与 reids 中的 token 比对
    const cacheToken = await this.redisService.get(`token_${id}`);
    if (!cacheToken) {
      throw new UnauthorizedException(AuthConstant.EXPIRED_TOKEN);
    }
    if (token !== cacheToken) {
      throw new UnauthorizedException(AuthConstant.ERROR_TOKEN);
    }

    // 重置 token 在 redis 中的缓存时间
    await this.redisService.set(
      `token_${id}`,
      token,
      this.configService.get('JWT_EXPIRES_IN'),
    );

    return { id: payload.id, username: payload.username };
  }
}
