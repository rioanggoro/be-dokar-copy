import { IsString, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
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
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateNested()
  @Type(() => GeneralInformationDto)
  generalInformation: GeneralInformationDto;

  // Field lain sesuai dengan entity Employee
}
