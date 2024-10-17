import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyAttendanceDto } from './create-daily_attendance.dto';

export class UpdateDailyAttendanceDto extends PartialType(CreateDailyAttendanceDto) {}
