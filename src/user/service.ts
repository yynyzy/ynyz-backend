import { Injectable } from '@nestjs/common';

// @Injectable() 装饰符（可注入的）
@Injectable()
export class UserService {
  login(): string {
    return 'login';
  }
}
