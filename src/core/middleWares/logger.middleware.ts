import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // 打印请求的路径
    console.log('Request Path:', req.path);

    // 打印请求的方法 (GET, POST, 等)
    console.log('Request Method:', req.method);

    // 打印请求的查询参数
    console.log('Request Query:', req.query);

    // 打印请求的请求体数据 (JSON 格式)
    console.log('Request Body:', req.body);
    next();
  }
}
