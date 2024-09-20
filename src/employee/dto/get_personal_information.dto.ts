import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetPersonalInformationEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
