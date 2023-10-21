import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { HashPasswordMiddleware } from 'src/core/middleWares/hashPassword.middleware';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes('user/register');
  }
}
