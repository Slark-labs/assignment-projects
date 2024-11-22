import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { query, Response } from 'express';
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
  @ApiResponse(
    SwaggerResponses.created(
      ExampleResponses.created,
      'User registration successful',
    ),
  )
  @ApiResponse(
    SwaggerResponses.internalServerError(
      ExampleResponses.internalServerError,
      'Internal server error',
    ),
  )
  @ApiResponse(
    SwaggerResponses.badRequest(ExampleResponses.badRequest, 'Invalid Input'),
  )
  @ApiResponse(
    SwaggerResponses.conflict(
      ExampleResponses.conflict,
      'Conflict:User already exist',
    ),
  )
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.createUser(createUserDto);

      // User created successfully
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        success: true,
        data: user.data?.token,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Validation failed.',
        error: [{ field: 'email', error: error.message }],
      });
    }
  }
  // Document the request body using the DTO
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse(SwaggerResponses.OK(ExampleResponses.OK))
  @ApiResponse(
    SwaggerResponses.internalServerError(ExampleResponses.internalServerError),
  )
  @ApiResponse(
    SwaggerResponses.notFound(ExampleResponses.notFound, 'Invalid Credentials'),
  )
  @ApiResponse(
    SwaggerResponses.badRequest(
      ExampleResponses.badRequest,
      'Invalid Credentials',
    ),
  )
  @ApiResponse(
    SwaggerResponses.forbidden(ExampleResponses.forbidden, 'user is blocked'),
  )
  async loginUser(@Body() loginUserDto: LoginDto, @Res() res: Response) {
    try {
      const user = await this.authService.login(loginUserDto);
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        success: true,
        data: user.data?.token,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Validation failed.',
        success: false,
        error: [{ field: 'general', error: error.message }],
      });
    }
  }
  @Get('verify-username')
  @ApiResponse(
    SwaggerResponses.found(ExampleResponses.OK, 'User found successfully'),
  )
  @ApiResponse(
    SwaggerResponses.notFound(ExampleResponses.notFound, 'User not found'),
  )
  @ApiResponse(
    SwaggerResponses.badRequest(
      ExampleResponses.badRequest,
      'Invalid username',
    ),
  )
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
    return res.status(HttpStatus.OK).json({
      message: 'User found successfully',
      success: true,
      exist: true,
    });
  }
  @Put('request-forget-password-otp')
  @ApiResponse(SwaggerResponses.notFound(ExampleResponses.notFound))
  @ApiResponse(SwaggerResponses.badRequest(ExampleResponses.badRequest))
  @ApiResponse(SwaggerResponses.forbidden(ExampleResponses.forbidden))
  @ApiResponse(
    SwaggerResponses.internalServerError(ExampleResponses.internalServerError),
  )
  @ApiQuery({
    name: 'username',
    type: String,
    required: false,
    description: 'The username of the user',
    example: 'john_doe',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'The email of the user',
    example: 'john_doe@gmail.com',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: 'The phone of the user',
    example: '92999292111',
  })
  async reqForgetPasswordOtp(
    @Query('username') username: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.reqForgetPasswordOtp({
        username,
        phone,
        email,
      });
      if (user) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'otp sent successfully', success: true });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
        error: { error },
      });
    }
  }
  @Get('verify-forget-password-otp')
  @ApiResponse(
    SwaggerResponses.OK(ExampleResponses.OK, 'Otp verified successfully'),
  )
  @ApiResponse(
    SwaggerResponses.notFound(ExampleResponses.notFound, 'Not found'),
  )
  @ApiResponse(
    SwaggerResponses.badRequest(ExampleResponses.badRequest, 'Invalid input'),
  )
  @ApiResponse(
    SwaggerResponses.internalServerError(
      ExampleResponses.internalServerError,
      'Internal server error',
    ),
  )
  @ApiQuery({
    name: 'username',
    type: String,
    required: false,
    description: 'The username of the user',
    example: 'john_doe',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'The email of the user',
    example: 'john_doe@gmail.com',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: 'The phone of the user',
    example: '92999292111',
  })
  async verifyForgetPasswordOtp(
    @Query('otp') otp: string,
    @Query('username') username: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.verifyForgetPasswordOtp({
        otp,
        username,
        phone,
        email,
      });

      return res.status(HttpStatus.OK).json({
        message: 'otp verify successfully',
        success: true,
        data: user.token,
      });
    } catch (error) {
      if (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          success: false,
          error: { error },
        });
      }
    }
  }
}
