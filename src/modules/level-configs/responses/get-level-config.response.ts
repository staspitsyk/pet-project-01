import { ApiProperty } from '@nestjs/swagger';
import { LevelConfig } from '../entities/level-config.entity';

export class GetLevelConfigResponse {
  @ApiProperty({ description: 'Id of level config', example: 1, type: Number })
  readonly id: number;

  @ApiProperty({ description: 'level of level config', example: 1, type: Number })
  readonly level: number;

  @ApiProperty({ description: 'startXp of level config', example: '1000', type: String })
  readonly startXp: string;

  @ApiProperty({ description: 'endXp of level config', example: '2000', type: String })
  readonly endXp: string;

  @ApiProperty({ description: 'createdDate of level config', example: '2024-02-02T15:06:25.887Z', type: Date })
  readonly createdDate: Date;

  @ApiProperty({ description: 'createdDate of level config', example: '2024-02-02T15:06:25.887Z', type: Date })
  readonly updatedDate: Date;
}

export class GetLevelConfigsResponse {
  constructor(levelConfigs: LevelConfig[]) {
    this.levelConfigs = levelConfigs;
  }

  @ApiProperty({ description: 'Stored level configs', type: [GetLevelConfigResponse] })
  levelConfigs: GetLevelConfigResponse[];
}
