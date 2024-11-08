import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { response, Response } from 'express';
import { LoginUser, RegisterUser } from 'services/user.service';
import { Token } from 'services/auth.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('api/auth')
export class UserController {
  constructor(
    private user: RegisterUser,
    private LoginUser: LoginUser,
    private token: Token,
  ) {}
  @Post('register')
  @ApiCreatedResponse({
    description: 'Created User Object as a response',
    content: {
      'application/json': {
        example: {
          message: 'User created successfully',
          success: true,
          data: {
            token: 'generated-token-value',
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'User already exists',
    content: {
      'application/json': {
        example: {
          message: 'User already exist',
          success: false,
        },
      },
    },
  })
  async registerUser(@Body() dto: UserDTO, @Res() response: Response) {
    const existUser = await this.user.existUser(dto.email);
    if (existUser) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'User already exist',
        success: false,
      });
    }
    const newUser = await this.user.createUser(dto);
    if (newUser) {
      const newToken = this.token.generateToken(newUser);
      return response.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        success: true,
        data: { token: newToken },
      });
    }
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Login successful',
    content: {
      'application/json': {
        example: {
          message: 'User logged in successfully',
          success: true,
          data: {
            token: 'generated-token-value',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: `User can't login try again!`,
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Invalid Credentials',
          success: false,
        },
      },
    },
  })
  async loginUser(@Body() dto: UserDTO, @Res() response: Response) {
    // Validate user credentials
    const user = await this.LoginUser.validateUser(dto);

    // Compare password
    const isPasswordMatch = await this.LoginUser.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordMatch || !user) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid Credentials', success: false });
    }

    // Generate token with validated user information
    const token = this.token.generateToken({ email: dto.email });

    return response.status(HttpStatus.OK).json({
      message: 'User logged in successfully',
      success: true,
      data: { token },
    });
  }
}
