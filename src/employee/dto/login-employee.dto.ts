import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginEmployeeDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
