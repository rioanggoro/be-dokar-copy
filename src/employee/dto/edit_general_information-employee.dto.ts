import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditGeneralInformationEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @IsString()
  @IsNotEmpty()
  place_of_birth: string;

  @IsString()
  @IsDateString()
  date_of_birth: string;

  @IsString()
  @IsNotEmpty()
  religion: string;

  @IsString()
  @IsNotEmpty()
  user_gender: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  user_addresses: string;

  @IsString()
  @IsNotEmpty()
  address_domicile: string;

  @IsString()
  @IsNotEmpty()
  last_education: string;
}
