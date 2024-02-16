import { BaseBadRequestError, BaseNotFoundError } from 'src/exceptions/base.errors';

export class ClientUiConfigNotFoundError extends BaseNotFoundError {
  constructor() {
    super(`Client Ui config does not exist`);
  }
}

export class ClientUiConfigAlreadyExistsError extends BaseBadRequestError {
  constructor() {
    super(`Client Ui config already exists`);
  }
}
