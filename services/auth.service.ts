import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

interface Iuser {
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

@Injectable()
export class Bcrypt {
  private saltRounds: number = 11;
  async hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }
  async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
