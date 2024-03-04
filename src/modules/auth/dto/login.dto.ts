import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: "User's email", example: 'john1994@gmail.com', type: String, nullable: false })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User's password", example: 'some-strong-password', type: String, nullable: false })
  @IsNotEmpty()
  @IsString()
  password: string;
}
