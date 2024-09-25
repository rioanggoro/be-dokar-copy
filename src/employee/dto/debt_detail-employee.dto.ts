import { IsNotEmpty, IsNumber } from 'class-validator';

export class DebtDetailEmployeelDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsNumber()
  @IsNotEmpty()
  id_debt_request: number;
}
