import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetGeneralInformationEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
