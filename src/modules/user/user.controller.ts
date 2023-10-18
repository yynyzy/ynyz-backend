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
} from './interface/user';
import { ExceptionConstant } from './constant/exceptionConstant';
import { RESPONSE_STATUS } from 'src/common/constant/constant';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 注册登陆接口返回值
  private Register_And_Login_Res: IRegisterAndLogin_Response;

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
              const authResult = await this.authService.certificate(user);
              if (authResult.status === RESPONSE_STATUS.SUCCESS) {
                this.Register_And_Login_Res.status = RESPONSE_STATUS.SUCCESS;
                this.Register_And_Login_Res.token = authResult.token;
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
            this.Register_And_Login_Res.user = {
              id: user.id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              avatar: user.avatar,
            };
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
  async findByUsername(
    @Request() req,
    @Query('username') username: string,
  ): Promise<User> {
    try {
      return await this.userService.findByUsername(username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
