import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('logger-middleware:-------');
    console.log('Request Path:', req.path);
    console.log('Request Method:', req.method);
    console.log('Request Query:', req.query);
    console.log('Request Body:', req.body);
    console.log('logger-middleware:-------');
    next();
  }
}
