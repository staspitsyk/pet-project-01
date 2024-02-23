import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ClientUiConfig } from '../../graphql/graphql.schema';
import { ClientUiConfigService } from './client-ui-config.service';
import { ClientUiConfig as ClientUiConfigModel } from './client-ui-config.schema';
import { CreateClientUiConfigDto } from './dto/create-client-ui-config.dto';

@Resolver('ClientUiConfig')
export class ClientUiConfigResolver {
  constructor(private readonly clientUiConfigService: ClientUiConfigService) {}

  @Query('clientUiConfig')
  async getClientUiConfig(): Promise<ClientUiConfig> {
    return this.clientUiConfigService.getClientUiConfig();
  }

  @ResolveField()
  async description(@Parent() clientUiConfig: ClientUiConfigModel): Promise<string> {
    return this.clientUiConfigService.getConfigDescription(clientUiConfig);
  }

  @Mutation('createClientUiConfig')
  async createClientUiConfig(
    @Args('createClientUiConfigInput') args: CreateClientUiConfigDto,
  ): Promise<ClientUiConfig> {
    await this.clientUiConfigService.createClientUiConfig(args);
    return this.clientUiConfigService.getClientUiConfig();
  }
}
