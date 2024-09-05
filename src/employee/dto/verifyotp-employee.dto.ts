import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyOtpEmployeeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
