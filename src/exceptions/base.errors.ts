interface BaseError {
  readonly type: string;
}

export class BaseNotFoundError extends Error implements BaseError {
  readonly type: string;
  constructor(message: string) {
    super(message);

    this.type = 'BaseNotFoundError';
  }
}
