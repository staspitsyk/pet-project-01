import { BaseBadRequestError, BaseNotFoundError } from 'src/exceptions/base.errors';

export class EmailAlreadyBookedError extends BaseBadRequestError {
  constructor(email: string) {
    super(`User with email ${email} already registered`);
  }
}

export class NicknameAlreadyBookedError extends BaseBadRequestError {
  constructor(nickname: string) {
    super(`User with nickname ${nickname} already registered`);
  }
}

export class UserNotFoundError extends BaseNotFoundError {
  constructor({ email, id }: { email?: string; id?: number }) {
    const value = email || id;
    const errorMessage = `User does not exist with ${email ? 'email' : 'id'} equals to ${value}`;

    super(errorMessage);
  }
}
