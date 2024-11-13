import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret_key = process.env.SECRET_KEY;
  private readonly expireIn = '1d';
  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret_key, { expiresIn: this.expireIn });
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.secret_key);
    } catch (error) {
      throw new Error('invalid token');
    }
  }
}
