import { Injectable } from '@nestjs/common';
import { CreateDailyAttendanceDto } from './dto/create-daily_attendance.dto';
import { UpdateDailyAttendanceDto } from './dto/update-daily_attendance.dto';

@Injectable()
export class DailyAttendanceService {
  create(createDailyAttendanceDto: CreateDailyAttendanceDto) {
    return 'This action adds a new dailyAttendance';
  }

  findAll() {
    return `This action returns all dailyAttendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyAttendance`;
  }

  update(id: number, updateDailyAttendanceDto: UpdateDailyAttendanceDto) {
    return `This action updates a #${id} dailyAttendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyAttendance`;
  }
}
