import { SequelizeOptions } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

const { DB_DIALECT, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } =
  process.env;

export const MySQL_Config: SequelizeOptions = {
  dialect: DB_DIALECT as Dialect, // 您使用的数据库类型
  host: DB_HOST, // 数据库主机
  port: Number(DB_PORT), // 数据库端口
  username: DB_USERNAME, // 数据库用户名
  password: DB_PASSWORD, // 数据库密码
  database: DB_DATABASE, // 数据库名称
};
