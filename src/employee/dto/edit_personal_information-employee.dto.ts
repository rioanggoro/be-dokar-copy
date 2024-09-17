import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditPersonalInformationEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsString()
  @IsNotEmpty()
  id_card: string;

  @IsNumber()
  @IsNotEmpty()
  tax_identification_number: number;
}
