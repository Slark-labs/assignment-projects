import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.createUser(createUserDto);

    if ('message' in user) {
      // Conflict response if user already exists
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: user.message, success: false });
    }

    // User created successfully
    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
      success: true,
      data: user.token,
    });
  }
}
