import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';

export class DebtRequestEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsNumber()
  @IsNotEmpty()
  @Max(10000000)
  nominal_request: number;

  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  account_name: string;

  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsNumber()
  @IsNotEmpty()
  borrowing_cost: number;

  @IsNumber()
  @IsNotEmpty()
  admin_fee: number;

  @IsNumber()
  @IsNotEmpty()
  grand_total_request: number;

  //   @IsNumber()
  //   @IsNotEmpty()
  remaining_saldo_debt: number; //Sisa saldo kasbon
}
