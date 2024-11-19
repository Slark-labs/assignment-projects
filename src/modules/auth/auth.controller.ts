import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/loginUser.dto';
import {
  ExampleResponses,
  SwaggerResponses,
} from 'src/common/responseDocs/swagger.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto }) // Describe the request body for registration
  @ApiResponse(SwaggerResponses.success(ExampleResponses.registerSuccess))
  @ApiResponse(SwaggerResponses.badRequest(ExampleResponses.badRequest))
  @ApiResponse(SwaggerResponses.conflict(ExampleResponses.conflict))
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.createUser(createUserDto);

      if (user.message === 'User already exist') {
        // Conflict response if user already exists
        return res.status(HttpStatus.CONFLICT).json({
          message: 'user already exist',
          success: false,
        });
      }

      // User created successfully
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        success: true,
        data: user.data?.token,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed.',
        errors: [{ field: 'email', error: 'Email is already taken.' }],
      });
    }
  }
  // Document the request body using the DTO
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse(SwaggerResponses.success(ExampleResponses.success))
  @ApiResponse(SwaggerResponses.notFound(ExampleResponses.notFound))
  @ApiResponse(SwaggerResponses.unauthorized(ExampleResponses.unauthorized))
  @ApiResponse(SwaggerResponses.badRequest(ExampleResponses.badRequest))
  async loginUser(@Body() loginUserDto: LoginDto, @Res() res: Response) {
    try {
      const user = await this.authService.login(loginUserDto);

      if (user.message === 'User not found') {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'User not found',
          success: false,
        });
      }

      if (user.message === 'Invalid credentials') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid credentials',
          success: false,
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        success: true,
        data: user.data?.token,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Validation failed.',
        success: false,
        errors: [{ field: 'general', error: error.message }],
      });
    }
  }
  @Get('verify-username')
  @ApiResponse(
    SwaggerResponses.successUsername(ExampleResponses.successUsername),
  )
  @ApiResponse(SwaggerResponses.notFound(ExampleResponses.notFound))
  @ApiResponse(SwaggerResponses.badRequest(ExampleResponses.badRequest))
  @ApiQuery({
    name: 'username',
    required: true,
    type: String,
    description: 'The username of the user',
    example: 'john_doe',
  })
  async verifyUserName(
    @Query('username') username: string,
    @Res() res: Response,
  ) {
    if (!username) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid username',
        success: false,
      });
    }
    const existUser = await this.authService.verifyUserName(username);
    if (!existUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
        success: false,
      });
    }
    return res.status(HttpStatus.FOUND).json({
      message: 'User found successfully',
      success: true,
      exist: true,
    });
  }
}
