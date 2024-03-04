import { BaseUnauthorizedError } from 'src/exceptions/base.errors';

export class UnauthorizedError extends BaseUnauthorizedError {
  constructor(errMessage: string) {
    super(errMessage);
  }
}
