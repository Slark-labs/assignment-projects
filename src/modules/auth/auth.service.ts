import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { CreateUserDto } from '../user/dto/user.dto';
import { JwtService } from './token/jwt.service';
import { hashPassword, comparePassword } from './auth.utils';
import { LoginDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwt: JwtService,
  ) {}
  // createUser logic
  async createUser(createUserDto: CreateUserDto) {
    try {
      // Check if a user with the same email or username already exists
      const existUser = await this.userModel.findOne({
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      // If a user exists, return an error message
      if (existUser) {
        return { message: 'User already exists', success: false };
      }

      // Validate if the password and confirm password match
      if (createUserDto.password !== createUserDto.confirmPassword) {
        return {
          message: 'Password and confirm password do not match',
          success: false,
        };
      }

      // Hash the password before saving
      const hashedPassword = await hashPassword(createUserDto.password);

      // Create a new user object
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      // Generate a JWT token
      const token = this.jwt.generateToken({
        username: newUser.username,
        email: newUser.email,
      });

      // Save the new user to the database
      await newUser.save();

      return {
        message: 'User created successfully',
        success: true,
        data: { newUser, token },
      };
    } catch (error) {
      console.error('Error creating user:', error);

      // Handle MongoDB duplicate key error (e.g., if email or username already exists)
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }

      // Throw a more general error if something unexpected happens
      throw new ConflictException('An error occurred while creating the user');
    }
  }

  // login user logic
  async login(loginUserDto: LoginDto) {
    try {
      const { username, email, phone, password } = loginUserDto;

      // Ensure at least one identifier (username, email, or phone) is provided
      if (!username && !email && !phone) {
        return {
          message: 'Provide either username, email, or phone.',
          success: false,
        };
      }

      // Check if the user exists using one of the provided identifiers
      const existUser = await this.userModel.findOne({
        $or: [
          { username: username || undefined },
          { email: email || undefined },
          { phone: phone || undefined },
        ],
      });

      if (!existUser) {
        return { message: 'User not found', success: false };
      }

      // Validate password
      const isValidPassword = await comparePassword(
        password,
        existUser.password,
      );
      if (!isValidPassword) {
        return { message: 'Invalid credentials', success: false };
      }

      // Generate JWT token
      const token = this.jwt.generateToken({
        username: existUser.username,
        email: existUser.email,
      });

      return {
        message: 'Login successful',
        success: true,
        data: { token },
      };
    } catch (error) {
      throw new ConflictException(
        error.message || 'An unexpected error occurred',
      );
    }
  }

  // verify username
  async verifyUserName(username: string) {
    const existUser = await this.userModel.findOne({ username: username });
    return !!existUser;
  }
}
