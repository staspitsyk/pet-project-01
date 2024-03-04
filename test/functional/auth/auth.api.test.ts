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
import { userDtoTemplate } from '../users/data/users.data';

describe('Auth REST Public API', () => {
  let levelConfigRepo: Repository<LevelConfig>;
  let levelConfigsRepository: LevelConfigsRepository;
  let usersRepo: Repository<User>;
  let app: INestApplication;
  let httpServer: any;
  let expiresInS: number;

  const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;

  beforeAll(async () => {
    app = await getTestApplication();

    levelConfigRepo = app.get(getRepositoryToken(LevelConfig));
    levelConfigsRepository = app.get(LevelConfigsRepository);
    usersRepo = app.get(getRepositoryToken(User));
    httpServer = app.getHttpServer();

    const configService = app.get(ConfigService);
    expiresInS = configService.getOrThrow('auth.jwt.expiresInS');
  });

  beforeEach(async () => {
    await Promise.all([levelConfigRepo.clear(), usersRepo.clear()]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST (/public/auth)', () => {
    it('Should response with status 400 and do not login with invalid data types', async () => {
      const invalidString = 123;
      const invalidEmail = 'some-email';
      const res = await request(httpServer).post(LOGIN_ROUTE).send({
        email: invalidEmail,
        password: invalidString,
      });

      expect(res.status).toEqual(400);
      expect(res.body.message).toContain('email must be an email');
      expect(res.body.message).toContain('password must be a string');
    });

    it('Should response with status 400 and do not login if mandatory properties are missed', async () => {
      const res = await request(httpServer).post(LOGIN_ROUTE).send({});

      expect(res.status).toEqual(400);
      expect(res.body.message).toContain('email should not be empty');
      expect(res.body.message).toContain('password should not be empty');
    });

    it('Should response with status 404 and do not login if user with provided email does not exist', async () => {
      const res = await request(httpServer).post(LOGIN_ROUTE).send({
        email: 'some-email@gmail.com',
        password: 'some-password',
      });

      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual('User does not exist with email equals to some-email@gmail.com');
    });

    it('Should response with status 401 and do not login if provided password is invalid', async () => {
      await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);

      await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

      const res = await request(httpServer).post(LOGIN_ROUTE).send({
        email: userDtoTemplate.email,
        password: 'some-random-password',
      });

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Invalid password');
    });

    it('Should response with status 200 and login', async () => {
      await levelConfigsRepository.createLevelConfig(levelConfigCandidateTemplate);

      const {
        body: { id },
      } = await request(httpServer).post(USERS_ROUTE).send(userDtoTemplate);

      const res = await request(httpServer).post(LOGIN_ROUTE).send({
        email: userDtoTemplate.email,
        password: userDtoTemplate.password,
      });

      expect(res.status).toEqual(200);
      expect(res.body.expiresInS).toEqual(expiresInS);
      expect(JSON.parse(atob(res.body.token.split('.')[1]))).toEqual({
        userId: id,
        email: userDtoTemplate.email,
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    });
  });
});
