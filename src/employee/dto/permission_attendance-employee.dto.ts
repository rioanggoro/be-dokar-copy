import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PermissionAttendanceEmployeeDto {
  @IsNumber()
  id_employee: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  proof_of_attendance: string;
}
