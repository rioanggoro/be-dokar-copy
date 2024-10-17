import { Module } from '@nestjs/common';
import { DailyAttendanceService } from './daily_attendance.service';
import { DailyAttendanceController } from './daily_attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyAttendance } from './entities/daily_attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyAttendance])],
  controllers: [DailyAttendanceController],
  providers: [DailyAttendanceService],
})
export class DailyAttendanceModule {}
