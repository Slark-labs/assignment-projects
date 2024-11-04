import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { Response } from 'express';
import { RegisterUser } from 'services/user.service';
import { Token } from 'services/auth.service';

@Controller('api/user')
export class UserController {
  constructor(
    private user: RegisterUser,
    private token: Token,
  ) {}
  @Post()
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
        message: 'success',
        data: newUser,
        token: newToken,
      });
    }
  }
}
