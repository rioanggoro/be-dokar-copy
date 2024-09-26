import { IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionAttendanceDetailEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsNumber()
  @IsNotEmpty()
  id_permission_attendance: number;
}
