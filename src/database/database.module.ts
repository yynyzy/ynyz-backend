import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';

/**
 * 默认情况下，Sequelize 使用模型名称的复数形式作为数据库表名称
 */
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async () => ({
        dialect: 'mysql', // 您使用的数据库类型
        host: 'localhost', // 数据库主机
        port: 3306, // 数据库端口
        username: 'root', // 数据库用户名
        password: 'yyn990902', // 数据库密码
        database: 'yzyn', // 数据库名称
        models: [User],
      }),
    }),
    // SequelizeModule.forFeature([User]),
  ],
})
export class DatabaseModule {}
