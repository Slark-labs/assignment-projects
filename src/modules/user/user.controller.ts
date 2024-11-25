import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  ExampleResponses,
  SwaggerResponses,
} from 'src/common/swaggerDocs/swagger.response';
import { log } from 'console';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(new AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse(
    SwaggerResponses.internalServerError(
      ExampleResponses.internalServerError,
      'Internal server error',
    ),
  )
  @ApiResponse(
    SwaggerResponses.notFound(ExampleResponses.notFound, 'Token not found'),
  )
  @ApiResponse(
    SwaggerResponses.unauthorized(
      ExampleResponses.unauthorized,
      'Not Authorized ',
    ),
  )
  @ApiResponse(
    SwaggerResponses.forbidden(ExampleResponses.unauthorized, 'Not Authorized'),
  )
  @ApiResponse(
    SwaggerResponses.OK(ExampleResponses.OK, 'User fetched successfully'),
  )
  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req['user'];
      const user = await this.userService.getMe(id);
      log(user);

      if (user) {
        return res.status(HttpStatus.OK).json({ user });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'internal server error',
        success: false,
        error: error.message,
      });
    }
  }
}
