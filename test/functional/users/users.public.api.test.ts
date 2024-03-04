import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';

import { LevelConfig } from 'src/modules/level-configs/entities/level-config.entity';
import { getTestApplication } from '../test-application';
import { levelConfigCandidateTemplate } from '../level-configs/data/level-configs.data';
import { LevelConfigsRepository } from 'src/modules/level-configs/level-configs.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { AUTH_ROUTE } from 'src/modules/auth/routes';
import { USERS_ROUTE } from 'src/modules/users/routes';
import { userDtoTemplate } from './data/users.data';
import { UsersRepository } from 'src/modules/users/users.repository';
import { createdDateUpdatedDateExpect } from '../../data/date-template.data';
import { AuthService } from 'src/modules/auth/auth.service';
import { levelConfigTemplate } from 'test/unit/level-configs/data/level-configs.data';

describe('Users REST Public API', () => {
  let levelConfigRepo: Repository<LevelConfig>;
  let levelConfigsRepository: LevelConfigsRepository;
  let usersRepo: Repository<User>;
  let usersRepository: UsersRepository;
  let authService: AuthService;
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    app = await getTestApplication();

    levelConfigRepo = app.get(getRepositoryToken(LevelConfig));
    levelConfigsRepository = app.get(LevelConfigsRepository);
    usersRepository = app.get(UsersRepository);
    usersRepo = app.get(getRepositoryToken(User));
    authService = app.get(AuthService);
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await Promise.all([levelConfigRepo.clear(), usersRepo.clear()]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST (/public/users)', () => {
    it('Should response with status 400 and do not save user with invalid data types', async () => {
      const invalidString = 123;
      const invalidEmail = 'some-email';
      const res = await request(httpServer).post(USERS_ROUTE).send({
        email: invalidEmail,
        password: invalidString,
        nickname: invalidString,
        name: invalidString,
      });

      expect(res.status).toEqual(400);
      expect(res.body.message).toContain('name must be a string');
      expect(res.body.message).toContain('email must be an email');
      expect(res.body.message).toContain('password must be a string');
      expect(res.body.message).toContain('nickname must be a string');
    });

    it('Should response with status 400 and do not save user if mandatory properties are missed', async () => {
      const res = await request(httpServer).post(USERS_ROUTE).send({});

      expect(res.status).toEqual(400);
      expect(res.body.message).toContain('nickname should not be empty');
      expect(res.body.message).toContain('email should not be empty');
      expect(res.body.message).toContain('password should not be empty');
    });

    it('Should response with status 201 and save user', async () => {
      await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);
      const res = await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

      const {
        body: { id },
      } = res;

      expect(res.status).toEqual(201);
      expect(await usersRepository.getUserById(id)).toEqual({
        id,
        ...userDtoTemplate,
        password: authService.hashPassword(userDtoTemplate.password),
        level: levelConfigCandidateTemplate.level,
        xp: levelConfigTemplate.startXp,
        ...createdDateUpdatedDateExpect,
      });
    });
  });

  describe('GET (/public/users/email/:email)', () => {
    it('Should response with status equals to 400 if provided email is invalid', async () => {
      const res = await request(httpServer).get(`${USERS_ROUTE}/email/some-string`).send(userDtoTemplate);

      expect(res.status).toEqual(400);
      expect(res.body.message).toContain('email must be an email');
    });

    it('Should response with status equals to 404 if user with provided email does not exist', async () => {
      const res = await request(httpServer).get(`${USERS_ROUTE}/email/some-email@gmail.com`).send(userDtoTemplate);

      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual('User does not exist with email equals to some-email@gmail.com');
    });

    it('Should response with status equals to 200 and return user', async () => {
      await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);
      const {
        body: { id },
      } = await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

      const res = await request(httpServer).get(`${USERS_ROUTE}/email/${userDtoTemplate.email}`).send(userDtoTemplate);

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id,
        name: userDtoTemplate.name,
        nickname: userDtoTemplate.nickname,
        email: userDtoTemplate.email,
        level: levelConfigCandidateTemplate.level,
        xp: levelConfigCandidateTemplate.startXp,
      });
    });

    describe('GET (/public/users/id/:id)', () => {
      it('Should response with status equals to 400 if provided id is invalid', async () => {
        const res = await request(httpServer).get(`${USERS_ROUTE}/id/some-string`).send(userDtoTemplate);

        expect(res.status).toEqual(400);
        expect(res.body.message).toContain('id must be a number string');
      });

      it('Should response with status equals to 404 if user with provided id does not exist', async () => {
        const res = await request(httpServer).get(`${USERS_ROUTE}/id/1`).send(userDtoTemplate);

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('User does not exist with id equals to 1');
      });

      it('Should response with status equals to 200 and return user', async () => {
        await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);
        const {
          body: { id },
        } = await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

        const res = await request(httpServer)
          .get(`${USERS_ROUTE}/email/${userDtoTemplate.email}`)
          .send(userDtoTemplate);

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
          id,
          name: userDtoTemplate.name,
          nickname: userDtoTemplate.nickname,
          email: userDtoTemplate.email,
          level: levelConfigCandidateTemplate.level,
          xp: levelConfigCandidateTemplate.startXp,
        });
      });
    });

    describe('DELETE (/public/users)', () => {
      it('Should response with status equals to 401 if not authorized', async () => {
        const res = await request(httpServer).delete(USERS_ROUTE);

        expect(res.status).toEqual(401);
        expect(res.body.message).toContain('Unauthorized');
      });

      it('Should response with status equals to 200 and delete user', async () => {
        await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);
        const {
          body: { id },
        } = await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

        expect(await usersRepository.getUserById(id)).toBeDefined();

        const {
          body: { token },
        } = await request(httpServer)
          .post(`${AUTH_ROUTE}/login`)
          .send({ email: userDtoTemplate.email, password: userDtoTemplate.password });

        const res = await request(httpServer).delete(USERS_ROUTE).set('authorization', `Bearer ${token}`);

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ isDeleted: true });
        expect(await usersRepository.getUserById(id)).toBeNull();
      });
    });

    describe('PATCH (/public/users)', () => {
      it('Should response with status equals to 401 if not authorized', async () => {
        const res = await request(httpServer).patch(USERS_ROUTE);

        expect(res.status).toEqual(401);
        expect(res.body.message).toContain('Unauthorized');
      });

      it('Should response with status equals to 400 and do not update user with invalid data types', async () => {
        const invalidString = 123;

        await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);
        await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

        const {
          body: { token },
        } = await request(httpServer)
          .post(`${AUTH_ROUTE}/login`)
          .send({ email: userDtoTemplate.email, password: userDtoTemplate.password });

        const res = await request(httpServer).patch(USERS_ROUTE).set('authorization', `Bearer ${token}`).send({
          name: invalidString,
          nickname: invalidString,
          email: 'some-email',
        });

        expect(res.status).toEqual(400);
        expect(res.body.message).toContain('property email should not exist');
        expect(res.body.message).toContain('name must be a string');
        expect(res.body.message).toContain('nickname must be a string');
      });

      it('Should response with status equals to 200 and update user', async () => {
        const newName = 'Alex';

        await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);
        const {
          body: { id },
        } = await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

        expect(await usersRepository.getUserById(id)).toEqual({
          id,
          ...userDtoTemplate,
          password: authService.hashPassword(userDtoTemplate.password),
          level: levelConfigCandidateTemplate.level,
          xp: levelConfigTemplate.startXp,
          ...createdDateUpdatedDateExpect,
        });

        const {
          body: { token },
        } = await request(httpServer)
          .post(`${AUTH_ROUTE}/login`)
          .send({ email: userDtoTemplate.email, password: userDtoTemplate.password });

        const res = await request(httpServer).patch(USERS_ROUTE).set('authorization', `Bearer ${token}`).send({
          name: newName,
        });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ isUpdated: true });
        expect(await usersRepository.getUserById(id)).toEqual({
          id,
          ...userDtoTemplate,
          name: newName,
          password: authService.hashPassword(userDtoTemplate.password),
          level: levelConfigCandidateTemplate.level,
          xp: levelConfigTemplate.startXp,
          ...createdDateUpdatedDateExpect,
        });
      });
    });
  });
});
