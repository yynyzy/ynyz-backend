import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './core/middleWares/logger.middleware';
import { DatabaseModule } from './entities/index.module';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [DatabaseModule, UserModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
