import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { EmailAlreadyBookedError, NicknameAlreadyBookedError, UserNotFoundError } from './users.errors';
import { AuthService } from '../auth/auth.service';
import { LevelConfigsService } from '../level-configs/level-configs.service';
import { UserCandidateInput } from './types';
import { User } from './entities/user.entity';
import { PatchUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly levelConfigsService: LevelConfigsService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<number> {
    const { email, password, nickname } = createUserDto;

    const userByNickname = await this.usersRepository.getUserByNickname(nickname);

    if (userByNickname) {
      throw new NicknameAlreadyBookedError(nickname);
    }

    const userByEmail = await this.usersRepository.getUserByEmail(email);

    if (userByEmail) {
      throw new EmailAlreadyBookedError(email);
    }

    const levelConfig = await this.levelConfigsService.getFirstLevelConfig();

    const userCandidateInput: UserCandidateInput = {
      ...createUserDto,
      password: this.authService.hashPassword(password),
      level: levelConfig.level,
      xp: levelConfig.startXp,
    };

    return this.usersRepository.createUser(userCandidateInput);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      throw new UserNotFoundError({ id });
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new UserNotFoundError({ email });
    }

    return user;
  }

  async updateUserById(id: number, updateUserDto: PatchUserDto): Promise<void> {
    await this.getUserById(id);
    await this.usersRepository.updateUserById(id, updateUserDto);
  }

  async deleteUserById(id: number): Promise<void> {
    await this.getUserById(id);
    await this.usersRepository.deleteUserById(id);
  }
}
