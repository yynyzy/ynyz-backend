import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Auth_Register_Interface,
  Auth_Response_Interface,
} from './interface/auth';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  private A_R_Response: Auth_Response_Interface;

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerData: Auth_Register_Interface,
  ): Promise<Auth_Response_Interface> {
    this.A_R_Response = {
      status: 'fail',
      userId: null,
      message: '',
    };
    if (registerData.username) {
      try {
        const user = await this.findByUsername(registerData.username);
        if (user) {
          this.A_R_Response.message = '用户已存在';
        } else {
          try {
            const user = await this.authService.register(registerData);
            if (user) {
              this.A_R_Response.status = 'success';
              this.A_R_Response.userId = user.id;
              this.A_R_Response.message = '用户注册成功';
            } else {
              this.A_R_Response.message = '用户注册失败';
            }
          } catch (error) {
            this.A_R_Response.message = error;
            return this.A_R_Response;
          }
        }
        return this.A_R_Response;
      } catch (error) {
        this.A_R_Response.message = error;
        return this.A_R_Response;
      }
    }
  }

  @Post('login')
  login() {
    return this.authService.login();
  }

  @Get('search')
  async findByUsername(@Query('username') username: string): Promise<User> {
    return await this.authService.findByUsername(username);
  }
}
