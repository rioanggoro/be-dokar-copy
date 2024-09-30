import { IsNotEmpty, IsNumber } from 'class-validator';

export class NotificationEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
