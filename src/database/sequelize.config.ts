import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
  dialect: 'mysql', // 您使用的数据库类型
  host: 'localhost', // 数据库主机
  port: 3306, // 数据库端口
  username: 'root', // 数据库用户名
  password: 'yyn990902', // 数据库密码
  database: 'yzyn', // 数据库名称
  models: [__dirname + '/**/*.model.ts'], // 包含模型文件的路径
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf('.model')) === member.toLowerCase()
    );
  },
});
