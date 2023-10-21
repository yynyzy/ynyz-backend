import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
// import { Role } from 'src/common/decorators/role.decorator';
import { AuthService } from '../auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ILogin_Body,
  IRegisterAndLogin_Response,
  IRegister_Body,
  SignOut_Response,
} from './interface/user';
import { ExceptionConstant } from './constant/exceptionConstant';
import { RESPONSE_STATUS } from 'src/common/constant/constant';
import { RedisService } from '../redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  // 注册登陆接口返回值
  private Register_And_Login_Res: IRegisterAndLogin_Response;
  private SignOut_Res: SignOut_Response;

  /**
   * @用户注册接口
   * @param IRegister_Body
   */
  @Public()
  @Post('register')
  async register(
    @Body() registerData: IRegister_Body,
  ): Promise<IRegisterAndLogin_Response> {
    this.Register_And_Login_Res = {
      status: RESPONSE_STATUS.FAIL,
    };
    if (registerData.username) {
      try {
        const user: User = await this.userService.findByUsername(
          registerData.username,
        );

        if (user) {
          this.Register_And_Login_Res.message =
            ExceptionConstant.USER_ALREADY_EXISTS;
        } else {
          try {
            const user: User = await this.userService.register(registerData);
            if (user) {
              const result = await this.authService.certificate(user);
              if (result.status === RESPONSE_STATUS.SUCCESS) {
                // 将 token 存入到 redis 中
                this.Register_And_Login_Res.status = RESPONSE_STATUS.SUCCESS;
                this.Register_And_Login_Res.token = result.token;
              } else {
                this.Register_And_Login_Res.message =
                  ExceptionConstant.FAILED_REGISTER;
              }
            } else {
              this.Register_And_Login_Res.message =
                ExceptionConstant.FAILED_REGISTER;
            }
          } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          }
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      this.Register_And_Login_Res.message = ExceptionConstant.ERROR_PARAMS;
    }
    return this.Register_And_Login_Res;
  }

  /**
   * @用户登陆接口
   * @param ILogin_Body
   */
  @Public()
  @Post('login')
  async login(@Body() loginData: ILogin_Body) {
    this.Register_And_Login_Res = {
      status: RESPONSE_STATUS.FAIL,
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
          if (certificateData.status === RESPONSE_STATUS.SUCCESS) {
            this.Register_And_Login_Res.status = RESPONSE_STATUS.SUCCESS;
            this.Register_And_Login_Res.token = certificateData.token;
          } else {
            this.Register_And_Login_Res.message =
              ExceptionConstant.FAILED_LOGIN;
          }
        } else {
          this.Register_And_Login_Res.message =
            ExceptionConstant.INCORRECT_PASSWORD;
        }
      } else {
        this.Register_And_Login_Res.message =
          ExceptionConstant.NO_USERNAME_ROLE;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return this.Register_And_Login_Res;
  }

  @Get('search')
  async findByUsername(@Query('username') username: string): Promise<User> {
    try {
      return await this.userService.findByUsername(username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('logout')
  async logout(@Request() req): Promise<SignOut_Response> {
    const user = req.user;
    try {
      const a = await this.redisService.delValue(user.token);
      this.SignOut_Res.status = RESPONSE_STATUS.SUCCESS;
      console.log('a', a);
    } catch (error) {
      this.SignOut_Res.status = RESPONSE_STATUS.FAIL;
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return this.SignOut_Res;
  }
}
