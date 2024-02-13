import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersDateService {
  getCurrentUTCtimeStamp(): number {
    return +new Date();
  }
}
