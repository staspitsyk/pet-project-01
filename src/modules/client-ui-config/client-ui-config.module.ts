import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClientUiConfigService } from './client-ui-config.service';
import { ClientUiConfig, ClientUiConfigSchema } from './client-ui-config.schema';
import { ClientUiConfigRepository } from './client-ui-config.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: ClientUiConfig.name, schema: ClientUiConfigSchema }])],
  providers: [ClientUiConfigService, ClientUiConfigRepository],
})
export class ClientUiConfigModule {}
