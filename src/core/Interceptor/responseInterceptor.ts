import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomResponse } from '../../common/Interface/customResponse';

/**
 * 响应格式为
 *  {
 *    statusCode: number
 *    data: any
 *  }
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  constructor(private readonly defaultCode: number = 200) {} // 设置默认的 code 值

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如何data包含了 statusCode，就直接返回它
        if (
          typeof data === 'object' &&
          data.hasOwnProperty('statusCode') &&
          data.hasOwnProperty('data')
        ) {
          return data; // 如果已经包含了 code 和 data 属性，直接返回
        }
        // 创建自定义响应对象默认 statusCode 为 200
        return new CustomResponse<T>(this.defaultCode, data);
      }),
    );
  }
}
