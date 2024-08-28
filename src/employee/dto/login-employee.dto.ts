import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginEmployeeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
