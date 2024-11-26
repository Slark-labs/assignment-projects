import {
  Body,
  Controller,
  Delete,
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
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  ExampleResponses,
  SwaggerResponses,
} from 'src/common/swaggerDocs/swagger.response';
import { log } from 'console';
import { DeleteUserDto } from './dto/user.dto';
@UseGuards(new AuthGuard())
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @ApiResponse(
    SwaggerResponses.internalServerError(
      ExampleResponses.internalServerError,
      'Internal server error',
    ),
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
    SwaggerResponses.OK(
      { message: 'User deleted successfully', success: true, user: {} },
      'User deleted successfully',
    ),
  )
  @Delete('me')
  @ApiBody({ type: DeleteUserDto })
  async deleteMe(
    @Body() dto: DeleteUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const { id } = req['user'];
      const user = await this.userService.deleteMe(id, dto);
      if (user) {
        return res.status(HttpStatus.OK).json({
          message: 'successfully deleted ',
          success: true,
          data: { user },
        });
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
