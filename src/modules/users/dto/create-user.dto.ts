import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: "User's name", example: 'John', type: String, nullable: true })
  @IsString()
  name: string;

  @ApiProperty({ description: "User's nickname", example: 'john1994', type: String, nullable: false })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({ description: "User's email", example: 'john1994@gmail.com', type: String, nullable: false })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password", example: 'some-strong-password', type: String, nullable: false })
  @IsNotEmpty()
  @IsString()
  password: string;
}
