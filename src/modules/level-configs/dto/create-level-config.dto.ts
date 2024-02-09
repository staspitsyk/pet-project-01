import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsPositive } from 'class-validator';

export class CreateLevelConfigDto {
  @ApiProperty({ description: 'A level number', example: 1, type: Number, nullable: false })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  level: number;

  @ApiProperty({ description: 'Minimum amount xp for level', example: '1000', type: String, nullable: false })
  @IsNotEmpty()
  @IsNumberString()
  startXp: string;

  @ApiProperty({ description: 'Maximum amount xp for level', example: '2000', type: String, nullable: false })
  @IsNotEmpty()
  @IsNumberString()
  endXp: string;
}
