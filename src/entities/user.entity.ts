import { Model, Column, Table } from 'sequelize-typescript';

/**
 * 用户信息表
 */
@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    primaryKey: true, // 将 'id' 列标记为主键
    autoIncrement: true, // 如果 'id' 是自增列，也可以添加这个选项
  })
  id: number;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  salt: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  status: number;

  @Column
  avatar: string;

  @Column
  deleted: number;
}
