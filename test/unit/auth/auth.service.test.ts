import * as crypto from 'crypto';

import { AuthService } from 'src/modules/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const password = 'some-password';

  beforeAll(async () => {
    authService = new AuthService();
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
