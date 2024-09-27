import { IsNotEmpty, IsNumber } from 'class-validator';

export class DebtHistoryEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
