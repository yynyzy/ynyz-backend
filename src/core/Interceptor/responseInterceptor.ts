import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomResponse } from '../../common/Interface/commonResponse';
import { HttpStatusCode } from 'src/common/constant/constant';

/**
 * @description:统一响应格式
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        data,
        statusCode: HttpStatusCode.SUCCESS,
      })),
    );
  }
}
