import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordEmployeeDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @IsNotEmpty()
  new_password: string;
}
