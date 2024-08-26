import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @IsNotEmpty()
  @IsString()
  sector: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  office_phone: string;

  @IsOptional()
  @IsDateString()
  employee_payday: string;

  @IsOptional()
  @IsString()
  company_role: string;

  @IsOptional()
  @IsString()
  contact_person: string;

  @IsOptional()
  @IsNumber()
  set_radius: number;

  @IsOptional()
  @IsNumber()
  shift_attendance_id: number;
}
