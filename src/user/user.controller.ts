import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/database/user/user.model';
// import { AuthGuard } from 'src/AuthGuard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('find2')
  findAll2(): string {
    return '123';
  }
}
