import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GetUserResponse {
  @ApiProperty({ description: "User's id", example: 1, type: Number })
  id: number;

  @ApiProperty({ description: "User's name", example: 1, type: Number })
  name: string;

  @ApiProperty({ description: "User's nickname", example: 1, type: Number })
  nickname: string;

  @ApiProperty({ description: "User's email", example: 1, type: Number })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ description: "User's level", example: 1, type: Number })
  level: number;

  @ApiProperty({ description: "User's xp", example: 1, type: Number })
  xp: string;

  @Exclude()
  createdDate: Date;

  @Exclude()
  updatedDate: Date;

  constructor(partial: Partial<GetUserResponse>) {
    Object.assign(this, partial);
  }
}
