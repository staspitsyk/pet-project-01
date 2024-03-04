import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UsersPublicController } from './users-public.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { AuthModule } from '../auth/auth.module';
import { LevelConfigsModule } from '../level-configs/level-configs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), LevelConfigsModule, JwtModule],
  controllers: [UsersPublicController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
