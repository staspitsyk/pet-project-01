import { BaseNotFoundError } from 'src/exceptions/base.errors';

export class LevelConfigNotFoundError extends BaseNotFoundError {
  constructor({ level, id }: { level?: number; id?: number }) {
    const value = level || id;
    const errorMessage = `Level config does not exist with ${level ? 'level' : 'id'} equals to ${value}`;

    super(errorMessage);
  }
}
