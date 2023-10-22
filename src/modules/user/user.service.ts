import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { IRegister_Body } from './interface/user';
import { IUser } from 'src/common/Interface/entityMappingInterface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async register(registerData: IRegister_Body): Promise<User> {
    try {
      const user = await this.userModel.create(registerData);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByUsername(username: string): Promise<IUser> {
    try {
      const user: IUser = await this.userModel.findOne({
        attributes: ['id', 'username', 'avatar'],
        where: { username, deleted: 0 },
      });
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async unSecurityFindByUsername(username: string): Promise<User> {
    try {
      const user: User = await this.userModel.findOne({
        where: { username, deleted: 0 },
      });
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
