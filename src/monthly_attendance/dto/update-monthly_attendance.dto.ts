import { PartialType } from '@nestjs/mapped-types';
import { CreateMonthlyAttendanceDto } from './create-monthly_attendance.dto';

export class UpdateMonthlyAttendanceDto extends PartialType(CreateMonthlyAttendanceDto) {}
