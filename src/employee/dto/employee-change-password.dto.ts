import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class EmployeeChangePasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;
}
