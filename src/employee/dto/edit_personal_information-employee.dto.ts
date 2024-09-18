import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class EditPersonalInformationEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(17)
  id_card: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(17)
  tax_identification_number: string;
}
