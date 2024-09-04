import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmployeeChangePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;
}
