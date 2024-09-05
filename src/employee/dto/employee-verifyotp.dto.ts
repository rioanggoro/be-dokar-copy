import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class EmployeeVerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
