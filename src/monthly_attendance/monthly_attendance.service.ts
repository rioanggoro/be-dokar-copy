import { Injectable } from '@nestjs/common';
import { CreateMonthlyAttendanceDto } from './dto/create-monthly_attendance.dto';
import { UpdateMonthlyAttendanceDto } from './dto/update-monthly_attendance.dto';

@Injectable()
export class MonthlyAttendanceService {
  create(createMonthlyAttendanceDto: CreateMonthlyAttendanceDto) {
    return 'This action adds a new monthlyAttendance';
  }

  findAll() {
    return `This action returns all monthlyAttendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monthlyAttendance`;
  }

  update(id: number, updateMonthlyAttendanceDto: UpdateMonthlyAttendanceDto) {
    return `This action updates a #${id} monthlyAttendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} monthlyAttendance`;
  }
}
