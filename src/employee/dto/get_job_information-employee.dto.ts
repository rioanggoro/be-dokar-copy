import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetJobInformationEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
