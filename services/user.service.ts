import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'models/user.model';
import { Model } from 'mongoose';
interface IUserData {
  name: string;
  email: string;
}
@Injectable()
export class RegisterUser {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(createUserDto: IUserData) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }
  async existUser(email: string) {
    const userExist = await this.userModel.findOne({ email }).exec();
    return !!userExist;
  }
}
