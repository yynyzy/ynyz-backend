import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import type { Request } from 'express';

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
    const user = { id: payload.id, username: payload.username };
    const cacheToken = await this.redisService.get(`token_${user.id}`);
    if (token !== cacheToken) {
      throw new UnauthorizedException('token 不正确');
    }
    if (!cacheToken) throw new UnauthorizedException('token 已过期');
    // if (!user) throw new UnauthorizedException('token 验证失败');
    await this.redisService.set(
      `token_${user.id}`,
      token,
      this.configService.get('JWT_EXPIRES_IN'),
    );

    return user;
  }
}
