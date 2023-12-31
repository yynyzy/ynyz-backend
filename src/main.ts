import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/httpException.filter';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './core/guards/JWTAuthGuard.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用统一异常处理器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局守卫
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  const configService = app.get(ConfigService);
  const port = configService.get('port') || 3000;
  await app.listen(port);
}
bootstrap();
