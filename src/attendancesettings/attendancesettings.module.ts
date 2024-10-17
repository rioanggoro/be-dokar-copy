import { Module } from '@nestjs/common';
import { AttendancesettingsService } from './attendancesettings.service';
import { AttendancesettingsController } from './attendancesettings.controller';

@Module({
  controllers: [AttendancesettingsController],
  providers: [AttendancesettingsService],
})
export class AttendancesettingsModule {}
