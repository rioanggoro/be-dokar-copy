import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEmployeeDto {
    @IsNumber()
  @IsNotEmpty()
  id_company: number;

  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;
}
