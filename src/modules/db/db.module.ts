import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';
/**
 * 默认情况下，Sequelize 使用模型名称的复数形式作为数据库表名称
 */
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get('database.DB_DIALECT'),
        host: configService.get('database.DB_HOST'),
        port: configService.get('database.DB_PORT'),
        username: configService.get('database.DB_USERNAME'),
        password: configService.get('database.DB_PASSWORD'),
        database: configService.get('database.DB_DATABASE'),
        models: [User],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
