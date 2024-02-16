import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

const originalErrorToHttpErrorMap = {
  BaseNotFoundError: NotFoundException,
  BaseBadRequest: BadRequestException,
};

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger('ErrorsInterceptor');

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          logger.error(error.message, { stack: error.stack, error });

          return throwError(() => error);
        }

        const HttpError = originalErrorToHttpErrorMap[error.type];

        if (!HttpError) {
          logger.fatal(error.message, { stack: error.stack, error });

          return throwError(() => new InternalServerErrorException('Oops, something went wrong'));
        }

        logger.error(error.message, { stack: error.stack, error });

        return throwError(() => new HttpError(error.message));
      }),
    );
  }
}
