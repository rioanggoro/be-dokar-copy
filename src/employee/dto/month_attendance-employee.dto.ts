import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class MonthAttendanceEmployeeDto {
  @IsNotEmpty()
  @IsNumber()
  id_employee: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  month: number; // Bulan yang ingin dihitung (1 - 12)

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  year: number; // Tahun yang ingin dihitung
}
