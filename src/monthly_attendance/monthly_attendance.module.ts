import { Module } from '@nestjs/common';
import { MonthlyAttendanceService } from './monthly_attendance.service';
import { MonthlyAttendanceController } from './monthly_attendance.controller';

@Module({
  controllers: [MonthlyAttendanceController],
  providers: [MonthlyAttendanceService],
})
export class MonthlyAttendanceModule {}
