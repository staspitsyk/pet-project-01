import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  getLogger(name: string): Logger {
    return new Logger(name);
  }
}
