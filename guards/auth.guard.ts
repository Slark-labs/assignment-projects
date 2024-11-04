import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { error } from 'console';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in headers');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decode = jwt.verify(token, 'shhh');
      if (!decode) {
        throw new UnauthorizedException('Token is not valid');
      }
      request.user = token;
      return true;
    } catch (error) {}
    console.log(error);
  }
}
