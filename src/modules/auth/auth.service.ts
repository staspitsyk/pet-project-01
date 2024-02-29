import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  isPasswordValid(password: string, haShedPassword: string): boolean {
    return haShedPassword === this.hashPassword(password);
  }
}
