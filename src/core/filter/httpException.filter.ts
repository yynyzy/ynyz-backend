import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/common/constant/constant';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status: number = exception.getStatus();

    response.status(status).json({
      statusCode: HttpStatusCode.FAILED,
      timestamp: new Date().toISOString(),
      message: exception.message,
      path: request.url,
    });
  }
}
