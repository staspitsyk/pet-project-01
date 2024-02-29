import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { User } from './entities/user.entity';
import { UserCandidateInput } from './types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(userCandidateInput: UserCandidateInput) {
    const userCandidate = this.usersRepo.create(userCandidateInput);

    const user = await this.usersRepo.save(userCandidate);

    return user.id;
  }

  getUserById(id: number): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email });
  }

  getUserByNickname(nickname: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ nickname });
  }

  updateUserById(id: number, user: Partial<User>): Promise<UpdateResult> {
    return this.usersRepo.createQueryBuilder().update().set(user).where({ id }).execute();
  }

  deleteUserById(id: number): Promise<DeleteResult> {
    return this.usersRepo.createQueryBuilder().delete().where({ id }).execute();
  }
}
