import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { Auth_Register_Interface } from './interface/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async register(registerData: Auth_Register_Interface): Promise<User> {
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
