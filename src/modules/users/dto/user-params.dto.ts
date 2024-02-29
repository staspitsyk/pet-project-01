import { IsEmail, IsNumberString } from 'class-validator';

export class GetUserByIdParams {
  @IsNumberString()
  id: number;
}

export class GetUserByEmailParams {
  @IsEmail()
  email: string;
}
