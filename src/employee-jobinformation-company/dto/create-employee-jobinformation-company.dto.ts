import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeJobinformationCompanyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
