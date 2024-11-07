import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'models/user.model';
import { Model } from 'mongoose';
import { Bcrypt } from './auth.service';
interface IUserData {
  name: string;
  email: string;
  password: string;
}
@Injectable()
export class RegisterUser {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly bcryptService: Bcrypt,
  ) {}
  async createUser(createUserDTO: IUserData) {
    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDTO.password,
    );
    const newUser = new this.userModel({
      ...createUserDTO,
      password: hashedPassword,
    });
    return newUser.save();
  }
  async existUser(email: string) {
    const userExist = await this.userModel.findOne({ email }).exec();
    return !!userExist;
  }
}
@Injectable()
export class LoginUser {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validateUser(credentials: IUserData) {
    const user = await this.userModel.findOne({
      email: credentials.email,
    });
    return !!user;
  }
  async loginUser(loginUserDTO: IUserData) {
    const user = await this.validateUser(loginUserDTO);
    return !!user;
  }
}
