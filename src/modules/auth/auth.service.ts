import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { CreateUserDto } from '../user/dto/user.dto';
import { JwtService } from '../../common/token/jwt.service';
import {
  hashPassword,
  comparePassword,
  generateOtp,
  hashedOtp,
  verifyOtp,
} from './auth.utils';
import { LoginDto } from './dto/loginUser.dto';
import {
  forgetPasswordDto,
  verifyForgetPasswordDto,
} from './dto/forgetPassword.dto';

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
          { phone: createUserDto.phone },
        ],
      });

      // If a user exists, return an error message
      if (existUser && existUser.status === 'deleted') {
        throw new HttpException(
          { message: 'User already exists', success: false },
          HttpStatus.CONFLICT,
        );
      }

      // Validate if the password and confirm password match
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new HttpException(
          {
            message: 'Password and confirm password do not match',
            success: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the password before saving
      const hashedPassword = await hashPassword(createUserDto.password);
      const otp = generateOtp();
      const hashOtp = await hashedOtp(otp);

      // Create a new user object
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        emailVerificationOtp: hashOtp,
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
        throw new HttpException(
          {
            message: 'Provide either username, email, or phone.',
            success: false,
          },
          HttpStatus.BAD_REQUEST,
        );
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
        throw new HttpException(
          { message: 'User not found', success: false },
          HttpStatus.NOT_FOUND,
        );
      }
      if (existUser.status === 'deleted') {
        throw new HttpException(
          { message: 'User not found', success: false },
          HttpStatus.NOT_FOUND,
        );
      }
      if (existUser.status === 'blocked') {
        throw new HttpException(
          { message: 'User is blocked', success: false },
          HttpStatus.FORBIDDEN,
        );
      }

      // Validate password
      const isValidPassword = await comparePassword(
        password,
        existUser.password,
      );
      if (!isValidPassword) {
        throw new HttpException(
          { message: 'Invalid credentials', success: false },
          HttpStatus.BAD_REQUEST,
        );
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
      throw new HttpException(
        {
          message: error.response?.message || 'An unexpected error occurred',
          success: false,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // verify username
  async verifyUserName(username: string) {
    const existUser = await this.userModel.findOne({ username: username });
    return !!existUser;
  }
  async reqForgetPasswordOtp(existUser: forgetPasswordDto) {
    try {
      const { username, email, phone } = existUser;

      if (!username && !email && !phone) {
        throw new HttpException(
          {
            message: 'Provide either username, email, or phone',
            success: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userModel.findOne({
        $or: [
          { username: username || undefined },
          { email: email || undefined },
          { phone: phone || undefined },
        ],
      });

      if (!user || user.status === 'deleted') {
        throw new HttpException(
          { message: 'User not found', success: false },
          HttpStatus.NOT_FOUND,
        );
      }

      if (user.status === 'blocked') {
        throw new HttpException(
          { message: 'User is blocked', success: false },
          HttpStatus.FORBIDDEN,
        );
      }
      const otp = generateOtp();

      const hashOtp = await hashedOtp(otp);
      user.forgotPasswordOTP = hashOtp;
      return !!user.save();
    } catch (error) {
      throw new error();
    }
  }
  async verifyForgetPasswordOtp(existUser: verifyForgetPasswordDto) {
    const { username, email, phone } = existUser;

    if (!username && !email && !phone) {
      throw new HttpException(
        {
          message: 'Provide either username, email, or phone',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userModel.findOne({
      $or: [
        { username: username || undefined },
        { email: email || undefined },
        { phone: phone || undefined },
      ],
    });

    if (!user || user.status === 'deleted') {
      throw new HttpException(
        { message: 'User not found', success: false },
        HttpStatus.NOT_FOUND,
      );
    }

    const isValidOtp = await verifyOtp(existUser.otp, user.forgotPasswordOTP);

    if (!isValidOtp) {
      throw new HttpException(
        { message: 'Otp doesnot match', success: false },
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = this.jwt.generateToken({
      username: user.username,
      email: user.email,
    });
    user.forgotPasswordOTP = '';
    await user.save();
    return { user, token };
  }
}
