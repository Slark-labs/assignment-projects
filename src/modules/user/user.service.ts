import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // getME SERVICE
  async getMe(id: string) {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user || user.status === 'deleted') {
      throw new HttpException(
        { message: 'Not authorized', success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.status === 'blocked') {
      throw new HttpException(
        { message: 'Not authorized', success: false },
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }
  //DELETE ME SERVICE
  async deleteMe(){}
}
