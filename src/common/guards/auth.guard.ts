import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new HttpException(
        { message: 'Token not found', success: false },
        HttpStatus.NOT_FOUND,
      );
    }
    const token = authHeader.split(' ')[1];
    try {
      const decode = jwt.decode(token.process.env.SECRET_KEY);
      if (!decode) {
        throw new HttpException(
          { message: 'Invalid token', success: false },
          HttpStatus.UNAUTHORIZED,
        );
      }
      request.user = token;
      return true;
    } catch (error) {
      throw new HttpException(
        { message: 'Token not found', success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
