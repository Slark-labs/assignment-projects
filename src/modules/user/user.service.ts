import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from './schema/user.schema';
import { DeleteUserDto, UpdateUserDto } from './dto/user.dto';

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
  async deleteMe(id: string, dto: DeleteUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { status: 'deleted' }, { new: true })
      .select('-password -__v');
    if (!user) {
      throw new HttpException(
        { message: 'Not authorized', success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (
      user?.email !== dto.email &&
      user?.username !== dto.username &&
      user?.id !== id
    ) {
      throw new HttpException(
        { message: 'Not authorized', success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async updateMe(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user || user.status === 'deleted') {
      throw new HttpException(
        { message: 'Not authorized', success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === 'blocked') {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    } else if (dto.username && !dto.phone) {
      const existUser = await this.userModel.findOne({
        username: dto.username,
      });
      if (existUser && existUser._id.toString() !== id) {
        throw new HttpException(
          { message: 'This username is already exist', success: false },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (!dto.username && dto.phone) {
      const existUser = await this.userModel.findOne({
        phone: dto.phone,
      });
      if (existUser && existUser._id.toString() !== id) {
        throw new HttpException(
          { message: 'This phone number is already exist', success: false },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.username && dto.phone) {
      const existUser = await this.userModel.findOne({
        $or: [
          { email: dto.email },
          { username: dto.username },
          { phone: dto.phone },
        ],
      });
      if (existUser && existUser._id.toString() !== id) {
        throw new HttpException(
          { message: 'User already exist', success: false },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { ...dto }, { new: true })
      .select('-password -__v');
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }
}
