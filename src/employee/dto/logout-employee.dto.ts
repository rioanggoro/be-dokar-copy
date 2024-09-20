import { IsNotEmpty, IsNumber } from 'class-validator';

export class LogoutEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
