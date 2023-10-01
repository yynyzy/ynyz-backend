import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './config/httpException.filter';
import { ResponseInterceptor } from './config/responseInterceptor';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用统一响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 使用统一异常处理器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局守卫
  app.useGlobalGuards(new AuthGuard(new Reflector()));
  await app.listen(3000);
}
bootstrap();
