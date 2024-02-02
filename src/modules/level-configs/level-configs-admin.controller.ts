import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

import { LevelConfigsService } from './level-configs.service';
import { CreateLevelConfigDto } from './dto/create-level-config.dto';
import { ADMIN_PREFIX } from 'src/constants/routes';
import { CreateLevelConfigResponse } from './responses/create-level-config.response';
import { GetLevelConfigResponse, GetLevelConfigsResponse } from './responses/get-level-config.response';

@ApiTags('level-configs')
@Controller(`${ADMIN_PREFIX}/level-configs`)
export class LevelConfigsAdminController {
  constructor(private readonly levelConfigsService: LevelConfigsService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateLevelConfigResponse })
  @ApiBody({ type: CreateLevelConfigDto })
  async create(@Body() createLevelConfigDto: CreateLevelConfigDto): Promise<CreateLevelConfigResponse> {
    const id = await this.levelConfigsService.createLevelConfig(createLevelConfigDto);

    return new CreateLevelConfigResponse(id);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: GetLevelConfigsResponse })
  async getLevelConfigs(): Promise<GetLevelConfigsResponse> {
    const levelConfigs = await this.levelConfigsService.getLevelConfigs();
    return new GetLevelConfigsResponse(levelConfigs);
  }

  @Get('/level/:level')
  @ApiParam({ name: 'level', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: GetLevelConfigResponse })
  getLevelConfigByLevel(@Param('level') level: number) {
    return this.levelConfigsService.getLevelConfigByLevel(level);
  }
}
