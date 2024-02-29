import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createdDateUpdatedDateExpect } from '../../data/date-template.data';
import { UsersRepository } from 'src/modules/users/users.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { userCandidateInputTemplate } from './data/users.data';
import { getTestModule } from '../test-module';

describe('UsersRepository', () => {
  let usersRepo: Repository<User>;
  let usersRepository: UsersRepository;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await getTestModule();

    usersRepository = testingModule.get(UsersRepository);
    usersRepo = testingModule.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await Promise.all([usersRepo.clear()]);
  });

  afterAll(async () => {
    await testingModule.close();
  });

  describe('createUser', () => {
    it('Should save user', async () => {
      const id = await usersRepository.createUser(userCandidateInputTemplate);

      expect(await usersRepo.findOneBy({ id })).toEqual({
        ...userCandidateInputTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });

    it('Should save user with sequential calls', async () => {
      const id1 = await usersRepository.createUser({
        ...userCandidateInputTemplate,
        nickname: 'john1',
        email: 'john1@gmail.com',
      });
      const id2 = await usersRepository.createUser({
        ...userCandidateInputTemplate,
        nickname: 'john2',
        email: 'john2@gmail.com',
      });

      expect(await usersRepo.findOneBy({ id: id1 })).toBeDefined();
      expect(await usersRepo.findOneBy({ id: id2 })).toBeDefined();
    });

    it('Should save user with parallel calls', async () => {
      const [id1, id2] = await Promise.all([
        usersRepository.createUser({ ...userCandidateInputTemplate, nickname: 'john1', email: 'john1@gmail.com' }),
        usersRepository.createUser({ ...userCandidateInputTemplate, nickname: 'john2', email: 'john2@gmail.com' }),
      ]);

      expect(await usersRepo.findOneBy({ id: id1 })).toBeDefined();
      expect(await usersRepo.findOneBy({ id: id2 })).toBeDefined();
    });

    it('Should save user with name equals to null', async () => {
      const { name, ...rest } = userCandidateInputTemplate;

      const id = await usersRepository.createUser({ ...rest });

      const user = await usersRepo.findOneBy({ id });

      expect(user?.name).toBeNull();
    });

    it('Should throw error if nickname is not unique', async () => {
      try {
        await usersRepository.createUser({ ...userCandidateInputTemplate, nickname: 'john1' });
        await usersRepository.createUser({ ...userCandidateInputTemplate, nickname: 'john1' });
      } catch (err) {
        expect(err.message).toContain('duplicate key value violates unique constraint');
      }

      expect.assertions(1);
    });

    it('Should throw error if email is not unique', async () => {
      try {
        await usersRepository.createUser({ ...userCandidateInputTemplate, email: 'john1@gmail.com' });
        await usersRepository.createUser({ ...userCandidateInputTemplate, email: 'john1@gmail.com' });
      } catch (err) {
        expect(err.message).toContain('duplicate key value violates unique constraint');
      }

      expect.assertions(1);
    });
  });

  describe('getUserById', () => {
    it('Should return null if user with provided id does not exists', async () => {
      expect(await usersRepository.getUserById(100500)).toBeNull();
    });

    it('Should return user with provided id if exists', async () => {
      const id = await usersRepository.createUser({ ...userCandidateInputTemplate });

      expect(await usersRepository.getUserById(id)).toEqual({
        ...userCandidateInputTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });
  });

  describe('getUserByEmail', () => {
    it('Should return null if user with provided email does not exists', async () => {
      expect(await usersRepository.getUserByEmail('some-email@gmail.com')).toBeNull();
    });

    it('Should return user with provided email if exists', async () => {
      const email = 'john@gmail.com';
      const id = await usersRepository.createUser({ ...userCandidateInputTemplate, email });

      expect(await usersRepository.getUserByEmail(email)).toEqual({
        ...userCandidateInputTemplate,
        email,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });
  });

  describe('getUserByNickname', () => {
    it('Should return null if user with provided nickname does not exists', async () => {
      expect(await usersRepository.getUserByNickname('some-nickname')).toBeNull();
    });

    it('Should return user with provided nickname if exists', async () => {
      const nickname = 'some-nickname';
      const id = await usersRepository.createUser({ ...userCandidateInputTemplate, nickname });

      expect(await usersRepository.getUserByNickname(nickname)).toEqual({
        ...userCandidateInputTemplate,
        nickname,
        id,
        ...createdDateUpdatedDateExpect,
      });
    });
  });

  describe('updateUserById', () => {
    it('Should update user by provided id', async () => {
      const id = await usersRepository.createUser({ ...userCandidateInputTemplate });

      const user = await usersRepository.getUserById(id);

      expect(user).toEqual({
        ...userCandidateInputTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });

      const updatedName = 'test-updated-name';

      await usersRepository.updateUserById(id, { name: updatedName });

      const updatedUser = await usersRepository.getUserById(id);

      expect(updatedUser).toEqual({
        ...userCandidateInputTemplate,
        name: updatedName,
        id,
        ...createdDateUpdatedDateExpect,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(user?.updatedDate < updatedUser?.updatedDate).toBeTruthy();
    });
  });

  describe('deleteUserById', () => {
    it('Should delete user by provided id', async () => {
      const id = await usersRepository.createUser({ ...userCandidateInputTemplate });

      const user = await usersRepository.getUserById(id);

      expect(user).toEqual({
        ...userCandidateInputTemplate,
        id,
        ...createdDateUpdatedDateExpect,
      });

      await usersRepository.deleteUserById(id);

      expect(await usersRepository.getUserById(id)).toBeNull();
    });
  });
});
