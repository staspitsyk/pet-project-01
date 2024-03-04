import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UnauthorizedError } from './auth.errors';
import { UserJwtPayload } from './types';

@Injectable()
export class AuthService {
  private expiresInS: number;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.expiresInS = configService.getOrThrow('auth.jwt.expiresInS');
  }

  async login(email: string, password: string): Promise<{ token: string; expiresInS: number }> {
    const user = await this.usersService.getUserByEmail(email);

    if (!this.isPasswordValid(password, user.password)) {
      throw new UnauthorizedError('Invalid password');
    }

    const payload: UserJwtPayload = { userId: user.id, email: user.email };

    return {
      token: await this.jwtService.signAsync(payload),
      expiresInS: this.expiresInS,
    };
  }

  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  isPasswordValid(password: string, haShedPassword: string): boolean {
    return haShedPassword === this.hashPassword(password);
  }
}
