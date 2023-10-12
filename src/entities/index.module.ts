import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MySQL_Config } from 'src/config/dataBase.config';
import { User } from './user.entity';

/**
 * 默认情况下，Sequelize 使用模型名称的复数形式作为数据库表名称
 */
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async () => ({
        ...MySQL_Config,
        models: [User],
      }),
    }),
  ],
})
export class DatabaseModule {}
