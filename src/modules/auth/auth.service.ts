import { User } from 'src/entities/user.entity';
import { Crypto } from '../../common/utils/index';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  JWT_Certificate_Response,
  validate_User_Password_Params,
} from './interface/auth';
import { InjectModel } from '@nestjs/sequelize';
import { RESPONSE_STATUS } from 'src/common/constant/constant';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  private jwt_certificate_res: JWT_Certificate_Response;

  /**
   * @jwt签证方法
   * @param user
   */
  async certificate(user: User): Promise<JWT_Certificate_Response> {
    this.jwt_certificate_res = {
      status: RESPONSE_STATUS.FAIL,
    };
    const payload = {
      id: user.id,
      username: user.username,
      // role: user.role, 以后需要把用户的权限角色也签名进去
    };
    try {
      const token: string = this.jwtService.sign(payload);
      this.jwt_certificate_res.status = RESPONSE_STATUS.SUCCESS;
      const TOKEN = {
        assess_token: token,
        refresh_token: '',
      };
      this.jwt_certificate_res.token = TOKEN;
      // 将 token 存入到 redis 中
      await this.redisService.set(
        `token_${user.id}`,
        token,
        this.configService.get('JWT_EXPIRES_IN'), // 注意这里
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return this.jwt_certificate_res;
  }

  // /**
  //  * @根据jwt中的id判断是否存在
  //  * @param validate_User_Password_Params
  //  */
  // async validateJWTId(id: number): Promise<User> {
  //   try {
  //     const user = await this.userModel.findOne({
  //       where: { id, deleted: 0 },
  //     });
  //     return user;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // /**
  //  * @根据用户名判断用户是否存在
  //  * @param validate_User_Password_Params
  //  */
  // async validateUsername(username: string): Promise<User> {
  //   try {
  //     const user = await this.userModel.findOne({
  //       where: { username, deleted: 0 },
  //     });
  //     return user;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  /**
   * @password验证是否正确
   * @param validate_User_Password_Params
   */
  validateUserPassword(params: validate_User_Password_Params): boolean {
    const hashInputPassword = Crypto.encrypt(params.password, params.salt);
    return params.hashedPassword === hashInputPassword;
  }
}
