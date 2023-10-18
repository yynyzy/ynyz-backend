import { User } from 'src/entities/user.entity';
import { Crypto } from '../../common/utils/index';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import {
  JWT_Certificate_Response,
  validate_User_Password_Params,
} from './interface/auth';
import { InjectModel } from '@nestjs/sequelize';
import { RESPONSE_STATUS } from 'src/common/constant/constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  private jwt_certificate_res: JWT_Certificate_Response;

  /**
   * @token验证方法
   * @param token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      if (!token) return false;
      const id = this.jwtService.verify(token.replace('Bearer ', ''));
      return id;
    } catch (e) {
      return false;
    }
  }

  /**
   * @jwt签证方法
   * @param user
   */
  certificate(user: User): JWT_Certificate_Response {
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
      this.jwt_certificate_res.token = token;
    } catch (error) {
      console.error(error);
    }
    return this.jwt_certificate_res;
  }

  /**
   * @根据jwt中的id判断是否存在
   * @param validate_User_Password_Params
   */
  async validateJWTId(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
    });
    return user;
  }

  /**
   * @根据用户名判断用户是否存在
   * @param validate_User_Password_Params
   */
  async validateUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username },
    });
    return user;
  }

  /**
   * @password验证是否正确
   * @param validate_User_Password_Params
   */
  validateUserPassword(params: validate_User_Password_Params): boolean {
    const hashInputPassword = Crypto.encrypt(params.password, params.salt);
    return params.hashedPassword === hashInputPassword;
  }
}
