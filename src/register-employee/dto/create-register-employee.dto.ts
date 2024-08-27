import {
  IsString,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeneralInformationDto {
  @IsString()
  @IsNotEmpty()
  user_idcard: string;

  @IsString()
  @IsNotEmpty()
  user_religion: string;

  // Field lain sesuai dengan entity GeneralInformation
}

export class CreateRegisterEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_company: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @ValidateNested()
  @Type(() => GeneralInformationDto)
  generalInformation: GeneralInformationDto;
}
