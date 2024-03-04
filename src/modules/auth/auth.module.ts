import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './auth.guard';
import { AuthPublicController } from './auth-public.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.getOrThrow('auth.jwt.secret'),
          signOptions: { expiresIn: configService.getOrThrow('auth.jwt.expiresInS') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthPublicController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
