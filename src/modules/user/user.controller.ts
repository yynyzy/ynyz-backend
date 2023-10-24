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
import { Public } from 'src/common/decorators/common.decorator';
import {
  ILogin_Body,
  IRegister_Body,
  IRegisterAndLogin_Response,
  ISearch_User_Response,
  ISignOut_Response,
} from './interface/user';
import { ExceptionConstant } from './constant/exceptionConstant';
import { RESPONSE_STATUS } from 'src/common/constant/constant';
import { RedisService } from '../redis/redis.service';
import { IUser } from 'src/common/Interface/entityMappingInterface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  // 注册登陆接口返回值
  private Register_And_Login_Res: IRegisterAndLogin_Response;
  private SignOut_Res: ISignOut_Response;
  private Search_User_Res: ISearch_User_Response;

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
      // const user = (await this.userService.findByUsername(
      //   registerData.username,
      // )) as IUser;
      const user: IUser = await this.userService.findByUsername(
        registerData.username,
      );
      if (user) {
        this.Register_And_Login_Res.message =
          ExceptionConstant.USER_ALREADY_EXISTS;
      } else {
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
  async login(
    @Body() loginData: ILogin_Body,
  ): Promise<IRegisterAndLogin_Response> {
    this.Register_And_Login_Res = {
      status: RESPONSE_STATUS.FAIL,
    };
    const user: User = await this.userService.unSecurityFindByUsername(
      loginData.username,
    );
    if (user) {
      const isUserPasswordCorrect: boolean =
        this.authService.validateUserPassword({
          password: loginData.password,
          hashedPassword: user.password,
          salt: user.salt,
        });
      if (isUserPasswordCorrect) {
        const certificateData = await this.authService.certificate(user);
        if (certificateData.status === RESPONSE_STATUS.SUCCESS) {
          this.Register_And_Login_Res.status = RESPONSE_STATUS.SUCCESS;
          this.Register_And_Login_Res.token = certificateData.token;
        } else {
          this.Register_And_Login_Res.message = ExceptionConstant.FAILED_LOGIN;
        }
      } else {
        this.Register_And_Login_Res.message =
          ExceptionConstant.INCORRECT_PASSWORD;
      }
    } else {
      this.Register_And_Login_Res.message = ExceptionConstant.NO_USERNAME_ROLE;
    }
    return this.Register_And_Login_Res;
  }

  /**
   * @用户登出接口
   */
  @Post('logout')
  async logout(@Request() req): Promise<ISignOut_Response> {
    this.SignOut_Res = {
      status: RESPONSE_STATUS.FAIL,
    };
    try {
      await this.redisService.del(`token_${req.user.id}`);
      this.SignOut_Res.status = RESPONSE_STATUS.SUCCESS;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return this.SignOut_Res;
  }

  /**
   * @根据用户名获取用户接口
   * @param String username
   */
  @Get('search')
  async findByUsername(
    @Query('username') username: string,
  ): Promise<ISearch_User_Response> {
    this.Search_User_Res = {
      status: RESPONSE_STATUS.FAIL,
    };

    const user: IUser = await this.userService.findByUsername(username);
    this.Search_User_Res.status = RESPONSE_STATUS.SUCCESS;
    this.Search_User_Res.user = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    };
    return this.Search_User_Res;
  }
}
