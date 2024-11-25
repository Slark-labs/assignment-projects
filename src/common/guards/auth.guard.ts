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

    // Check if authorization header is present
    if (!authHeader) {
      throw new HttpException(
        { message: 'Token not found', success: false },
        HttpStatus.NOT_FOUND,
      );
    }

    // Split to get the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException(
        { message: 'Token not found', success: false },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!decoded) {
        throw new HttpException(
          { message: 'Invalid token', success: false },
          HttpStatus.UNAUTHORIZED,
        );
      }
      request.user = decoded; // Attach user info to the request
      return true;
    } catch (error) {
      // Handle invalid or expired token
      throw new HttpException(
        { message: 'Invalid token', success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
