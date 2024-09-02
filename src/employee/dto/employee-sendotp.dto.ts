import { IsNotEmpty, IsString } from 'class-validator';
export class EmployeeSendOtpDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
