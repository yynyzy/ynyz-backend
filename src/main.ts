import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/httpException.filter';
import { ResponseInterceptor } from './core/Interceptor/responseInterceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用统一响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 使用统一异常处理器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局守卫
  app.useGlobalGuards(new AuthGuard(new Reflector()));

  const configService = app.get(ConfigService);
  const port = configService.get('port') || 3000;
  await app.listen(port);
}
bootstrap();
