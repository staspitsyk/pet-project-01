import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelConfigResponse {
  constructor(id: number) {
    this.id = id;
  }

  @ApiProperty({ description: 'An Id of created level config', example: 1, type: Number })
  private readonly id: number;
}
