import { User } from 'src/entities/user.entity';
import { Crypto } from '../../common/utils/index';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(password: string, salt: string): Promise<any> {
    console.log('JWT验证 - Step 2: 校验用户信息');
    const hashedPassword = password;
    // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
    const hashPassword = Crypto.encrypt(password, salt);
    if (hashedPassword === hashPassword) {
      // 密码正确
      return true;
    } else {
      // 密码错误
      return false;
    }
  }

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

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: User) {
    const payload = {
      username: user.username,
      id: user.id,
      // role: user.role, 以后需要把用户的权限角色也签名进去
    };
    console.log('xxxpayload', this.jwtService);

    console.log('JWT验证 - Step 3: 处理 jwt 签证');
    try {
      const token = this.jwtService.sign(payload);
      return {
        status: 0,
        token,
      };
    } catch (error) {
      console.log('xxxxerror=', error);
      return {
        status: 1,
        message: '账号或密码错误',
      };
    }
  }
}
