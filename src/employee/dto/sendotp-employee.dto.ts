import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpEmployeeDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;
}
