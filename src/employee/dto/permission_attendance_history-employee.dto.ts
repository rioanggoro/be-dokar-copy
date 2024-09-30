import { IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionAttendanceHistoryEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
