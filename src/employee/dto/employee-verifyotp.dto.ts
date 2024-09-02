import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class EmployeeVerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
