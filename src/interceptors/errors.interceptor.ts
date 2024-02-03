import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const originalErrorToHttpErrorMap = {
  BaseNotFoundError: NotFoundException,
};

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const HttpError = originalErrorToHttpErrorMap[err.type];

        if (!HttpError) {
          return throwError(() => new InternalServerErrorException('Oops, something went wrong'));
        }

        return throwError(() => new HttpError(err.message));
      }),
    );
  }
}
