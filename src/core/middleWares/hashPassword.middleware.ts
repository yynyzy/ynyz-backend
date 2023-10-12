import { Injectable, NestMiddleware } from '@nestjs/common';
import { Crypto } from '../../common/utils/index';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const pwd = req.body['password'];
    if (pwd) {
      const salt = Crypto.addSalt();
      req.body['password'] = Crypto.encrypt(pwd, salt);
      req.body['salt'] = salt;
    }

    next();
  }
}
