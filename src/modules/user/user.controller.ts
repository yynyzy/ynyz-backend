import { Body, Controller, Request, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
// import { Role } from 'src/common/decorators/role.decorator';
import { AuthService } from '../auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ILogin_Body,
  IRegisterAndLogin_Response,
  IRegister_Body,
} from './interface/user';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 注册登陆接口返回值
  private Register_And_Login_Res: IRegisterAndLogin_Response;

  @Public()
  @Post('register')
  async register(
    @Body() registerData: IRegister_Body,
  ): Promise<IRegisterAndLogin_Response> {
    this.Register_And_Login_Res = {
      status: 'fail',
    };
    if (registerData.username) {
      try {
        const user: User = await this.userService.findByUsername(
          registerData.username,
        );

        if (user) {
          this.Register_And_Login_Res.message = '用户已存在';
        } else {
          try {
            const user: User = await this.userService.register(registerData);
            console.log('user', user);
            if (user) {
              const authResult = await this.authService.certificate(user);
              if (authResult.status === 'success') {
                this.Register_And_Login_Res.status = 'success';
                this.Register_And_Login_Res.message = '用户注册成功';
                this.Register_And_Login_Res.token = authResult.token;
              } else {
                this.Register_And_Login_Res.message = '用户注册失败';
              }
            } else {
              this.Register_And_Login_Res.message = '用户注册失败';
            }
          } catch (error) {
            this.Register_And_Login_Res.message = error;
          }
        }
      } catch (error) {
        this.Register_And_Login_Res.message = error;
      }
    } else {
      this.Register_And_Login_Res;
    }
    return this.Register_And_Login_Res;
  }

  @Public()
  @Post('login')
  async login(@Body() loginData: ILogin_Body) {
    this.Register_And_Login_Res = {
      status: 'fail',
    };
    try {
      const user: User = await this.userService.findByUsername(
        loginData.username,
      );
      if (user) {
        const isUserPasswordCorrect: boolean =
          this.authService.validateUserPassword({
            password: loginData.password,
            hashedPassword: user.password,
            salt: user.salt,
          });
        // const authResult = await this.authService.verifyToken()
        if (isUserPasswordCorrect) {
          const certificateData = this.authService.certificate(user);
          if (certificateData.status === 'success') {
            this.Register_And_Login_Res.status = 'success';
            this.Register_And_Login_Res.message = '用户登陆成功';
            this.Register_And_Login_Res.token = certificateData.token;
            this.Register_And_Login_Res.user = {
              id: user.id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              avatar: user.avatar,
            };
          } else {
            this.Register_And_Login_Res.message = '用户登陆失败';
          }
        } else {
          this.Register_And_Login_Res.message = '用户密码不正确';
        }
      } else {
        this.Register_And_Login_Res.message = '无当前用户名角色';
      }
    } catch (error) {
      this.Register_And_Login_Res.message = error;
    }
    return this.Register_And_Login_Res;
  }

  @Get('search')
  async findByUsername(
    @Request() req,
    @Query('username') username: string,
  ): Promise<User> {
    console.log('req', req.user);

    return await this.userService.findByUsername(username);
  }
}
