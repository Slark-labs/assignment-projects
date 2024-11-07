import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { response, Response } from 'express';
import { LoginUser, RegisterUser } from 'services/user.service';
import { Token } from 'services/auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
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
  @ApiCreatedResponse({ description: 'Created User Object as a response' })
  @ApiBadRequestResponse({ description: 'User cannot register try again!' })
  async registerUser(@Body() dto: UserDTO, @Res() response: Response) {
    const existUser = await this.user.existUser(dto.email);
    if (existUser) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'User already exist',
      });
    }
    const newUser = await this.user.createUser(dto);
    if (newUser) {
      const newToken = this.token.generateToken(newUser);
      return response.status(HttpStatus.CREATED).json({
        message: 'user created successfully',
        success: true,
        data: { token: newToken },
      });
    }
  }
  @Post('login')
  
  @ApiCreatedResponse({ description: 'Login User Object as a response' })
  @ApiBadRequestResponse({ description: 'User cannot login try again!' })
  async loginUser(@Body() dto: UserDTO, @Res() response: Response) {
    // Validate user credentials
    const user = await this.LoginUser.validateUser(dto);

    if (!user) {
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
