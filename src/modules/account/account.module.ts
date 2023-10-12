import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { HashPasswordMiddleware } from 'src/core/middleWares/hashPassword.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes('account/register');
  }
}
