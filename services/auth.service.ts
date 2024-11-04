import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface Iuser {
  name: string;
  email: string;
}
@Injectable()
export class Token {
  private readonly secretKey: string = 'shhh';

  generateToken(user: Iuser): string {
    const payload = { email: user.email };

    return jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
  }
}
