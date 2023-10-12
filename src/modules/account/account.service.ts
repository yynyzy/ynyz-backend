import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { Account_Register_Dto } from './interface/account';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async register(registerData: Account_Register_Dto): Promise<User> {
    const account = await this.userModel.create(registerData);
    console.log('account', account);
    return account;
  }

  async findByUsername(username: string): Promise<User> {
    const account = await this.userModel.findOne({
      where: { username },
    });
    return account;
  }

  login() {
    return this.userModel.findAll();
  }
}
