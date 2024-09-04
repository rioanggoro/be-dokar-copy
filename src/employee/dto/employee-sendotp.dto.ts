import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmployeeSendOtpDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
