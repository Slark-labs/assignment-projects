import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { CreateUserDto } from '../user/dto/user.dto';
import { JwtService } from './token/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwt: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existUser = await this.userModel.findOne({
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });
      if (existUser) {
        return { message: 'User already exist' };
      }
      const newUser = new this.userModel(createUserDto);
      const token = this.jwt.generateToken({
        username: createUserDto.username,
        email: createUserDto.email,
      });
      await newUser.save();
      return { newUser, token };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('user already exist');
      }
    }
  }
}
