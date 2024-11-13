import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { validate } from 'class-validator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ConflictResponse,
  SuccessResponse,
  ValidationErrorResponse,
} from '../../common/index';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto }) // Describe the request body
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
    type: ValidationErrorResponse,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists.',
    type: ConflictResponse,
  })
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.createUser(createUserDto);

    if (user.message === 'User already exist') {
      // Conflict response if user already exists
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: 'user already exist', success: false });
    }

    // User created successfully
    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
      success: true,
      data: user.data?.token,
    });
  }
}
