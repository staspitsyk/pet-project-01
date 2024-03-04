import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';

export const JwtServiceMock = createMock<JwtService>();
