import * as crypto from 'crypto';

import { AuthService } from 'src/modules/auth/auth.service';
import { UsersServiceMock } from '../../mocks/users.service.mock';
import { ConfigServiceMock } from 'test/mocks/config.service.mock';
import { JwtServiceMock } from 'test/mocks/jwt.service.mock';

describe('AuthService', () => {
  let authService: AuthService;
  const password = 'some-password';

  beforeAll(async () => {
    authService = new AuthService(UsersServiceMock, ConfigServiceMock, JwtServiceMock);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('hashPassword', () => {
    it('Should return hashed sha256 password', () => {
      const hashedPassword = authService.hashPassword(password);

      expect(hashedPassword).toEqual(crypto.createHash('sha256').update(password).digest('hex'));
    });
  });

  describe('isPasswordValid', () => {
    it('Should return true if passwords hashes matches ', () => {
      const hashedPassword = authService.hashPassword(password);

      expect(authService.isPasswordValid(password, hashedPassword)).toBeTruthy();
    });

    it('Should return false if passwords hashes do not matches ', () => {
      const hashedPassword = authService.hashPassword(password);

      expect(authService.isPasswordValid('some-random-password', hashedPassword)).toBeFalsy();
    });
  });
});
