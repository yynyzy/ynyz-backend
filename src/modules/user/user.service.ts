import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { Register_Request_Interface } from './interface/user';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async register(registerData: Register_Request_Interface): Promise<User> {
    const user = await this.userModel.create(registerData);
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username },
    });
    return user;
  }

  login() {
    return this.userModel.findAll();
  }
}
