import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class EmployeePermissionAttendanceDto {
  // @IsString()
  // @IsNotEmpty()
  // token_auth: string;

  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  proof_of_attendance: string;
}
