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
import { IUser, JwtService } from '../../common/token/jwt.service';
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
  private constructTokenPayload(user: User): IUser {
    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      emailVerified: user.emailVerified || false,
      phoneVerified: user.phoneVerified || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  // createUser logic

  async createUser(createUserDto: CreateUserDto) {
    try {
      // Check for existing user
      const existUser = await this.userModel.findOne({
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username },
          { phone: createUserDto.phone },
        ],
      });

      if (existUser) {
        throw new HttpException(
          { message: 'User already exists', success: false },
          HttpStatus.CONFLICT,
        );
      }

      // Validate password match
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new HttpException(
          { message: 'Passwords do not match', success: false },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash password and OTP
      const hashedPassword = await hashPassword(createUserDto.password);
      const otp = generateOtp();
      const hashOtp = await hashedOtp(otp);

      // Create new user object
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        emailVerificationOtp: hashOtp,
      });

      await newUser.save();

      // Construct JWT payload
      const tokenPayload = this.constructTokenPayload(newUser);

      // Generate JWT token
      const token = this.jwt.generateToken(tokenPayload);

      return {
        message: 'User created successfully',
        success: true,
        data: { newUser, token },
      };
    } catch (error) {
      console.error('Error creating user:', error);

      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }

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
      const payload = this.constructTokenPayload(existUser);
      const token = this.jwt.generateToken(payload);

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
    const payload = this.constructTokenPayload(user);
    const token = this.jwt.generateToken(payload);
    user.forgotPasswordOTP = '';
    await user.save();
    return { user, token };
  }
}
