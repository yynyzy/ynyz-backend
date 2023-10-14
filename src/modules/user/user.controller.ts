import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
// import { Role } from 'src/common/decorators/role.decorator';
import {
  Login_Request_Interface,
  Register_Request_Interface,
  Register_Response_Interface,
} from './interface/user';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  private R_Response: Register_Response_Interface;

  @Post('register')
  async register(
    @Body() registerData: Register_Request_Interface,
  ): Promise<Register_Response_Interface> {
    this.R_Response = {
      status: 'fail',
      message: '',
    };
    if (registerData.username) {
      try {
        const user: User = await this.userService.findByUsername(
          registerData.username,
        );
        console.log('user1111111', user);

        if (user) {
          this.R_Response.message = '用户已存在';
        } else {
          try {
            const user: User = await this.userService.register(registerData);
            console.log('user', user);
            if (user) {
              const authResult = await this.authService.certificate(user);
              if (authResult.status === 0) {
                this.R_Response.status = 'success';
                this.R_Response.message = '用户注册成功';
                this.R_Response.token = authResult.token;
              } else {
                this.R_Response.message = authResult.message;
              }
            } else {
              this.R_Response.message = '用户注册失败';
            }
          } catch (error) {
            this.R_Response.message = error;
            return this.R_Response;
          }
        }
        return this.R_Response;
      } catch (error) {
        this.R_Response.message = error;
        return this.R_Response;
      }
    }
  }

  @Post('login')
  async login(@Body() loginData: Login_Request_Interface) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const user = await this.userService.findByUsername(loginData.username);
    if (user) {
      const authResult = await this.authService.validateUser(
        user.username,
        user.salt,
      );
      // const authResult = await this.authService.verifyToken()
      switch (authResult.code) {
        case 1:
          return this.authService.certificate(authResult.user);
        case 2:
          return {
            code: 1,
            msg: authResult.message,
          };
        default:
      }
    }
    return {
      code: 600,
      msg: `查无此人`,
    };
  }

  @Get('search')
  async findByUsername(@Query('username') username: string): Promise<User> {
    return await this.userService.findByUsername(username);
  }
}
