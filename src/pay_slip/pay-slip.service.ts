import { Injectable } from '@nestjs/common';
import { CreatePaySlipDto } from './dto/create-pay-slip.dto';
import { UpdatePaySlipDto } from './dto/update-pay-slip.dto';

@Injectable()
export class TotalMonthlyAttendanceService {
  create(createTotalMonthlyAttendanceDto: CreatePaySlipDto) {
    return 'This action adds a new totalMonthlyAttendance';
  }

  findAll() {
    return `This action returns all totalMonthlyAttendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} totalMonthlyAttendance`;
  }

  update(id: number, updateTotalMonthlyAttendanceDto: UpdatePaySlipDto) {
    return `This action updates a #${id} totalMonthlyAttendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} totalMonthlyAttendance`;
  }
}
