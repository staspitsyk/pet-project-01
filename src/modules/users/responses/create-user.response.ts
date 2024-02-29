import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  constructor(id: number) {
    this.id = id;
  }

  @ApiProperty({ description: 'An Id of created user', example: 1, type: Number })
  private readonly id: number;
}
