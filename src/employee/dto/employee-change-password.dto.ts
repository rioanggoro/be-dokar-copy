import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EmployeeChangePasswordDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' }) // Validasi panjang password
  new_password: string;
}
