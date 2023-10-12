import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find')
  @Role('admin')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('find2')
  findAll2(): any {
    return {
      statusCode: 444,
      data: '123',
    };
  }
}
