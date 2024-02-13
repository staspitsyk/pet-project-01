import { Global, Module } from '@nestjs/common';

import { HelpersDateService } from './date/helpers.date.service';

@Global()
@Module({
  providers: [HelpersDateService],
  exports: [HelpersDateService],
})
export class HelpersModule {}
