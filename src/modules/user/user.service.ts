import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { IRegister_Body } from './interface/user';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async register(registerData: IRegister_Body): Promise<User> {
    const user = await this.userModel.create(registerData);
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username },
    });
    return user;
  }
}
