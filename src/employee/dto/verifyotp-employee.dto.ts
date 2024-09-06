import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyOtpEmployeeDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
