import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './service';
import { LoginDto } from './dto/login.dto';
// import { AuthGuard } from 'src/AuthGuard';

@Controller('user')
export class UserController {
  private readonly logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger('User Logger');
  }

  @Post('login')
  getUrlQuery(@Body() loginDto: LoginDto): string {
    console.log('loginDto', loginDto);

    return this.userService.login();
  }
}
