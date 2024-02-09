import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { ErrorsInterceptor } from 'src/interceptors/errors.interceptor';

export const getTestApplication = async (): Promise<INestApplication> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorsInterceptor());

  await app.init();

  return app;
};
