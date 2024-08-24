// src/register-employee/dto/create-register-employee.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRegisterEmployeeDto {
  @IsNotEmpty()
  @IsNumber()
  id_company: number;

  @IsNotEmpty()
  @IsNumber()
  id_employee: number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;
}
