import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  Account_Register_Dto,
  Account_Register_Response,
} from './interface/account';
import { User } from 'src/entities/user.entity';

@Controller('account')
export class AccountController {
  private A_R_Response: Account_Register_Response;

  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async register(
    @Body() registerData: Account_Register_Dto,
  ): Promise<Account_Register_Response> {
    this.A_R_Response = {
      status: 'fail',
      message: '',
    };
    if (registerData.username) {
      try {
        const account = await this.findByUsername(registerData.username);
        if (account) {
          this.A_R_Response.message = '用户已存在';
        } else {
          try {
            const account = await this.accountService.register(registerData);
            if (account) {
              this.A_R_Response.status = 'success';
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
    return this.accountService.login();
  }

  @Get('search')
  async findByUsername(@Query('username') username: string): Promise<User> {
    return await this.accountService.findByUsername(username);
  }
}
