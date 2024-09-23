import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetCardAssuranceEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
