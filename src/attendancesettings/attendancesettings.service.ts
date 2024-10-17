import { Injectable } from '@nestjs/common';
import { CreateAttendancesettingDto } from './dto/create-attendancesetting.dto';
import { UpdateAttendancesettingDto } from './dto/update-attendancesetting.dto';

@Injectable()
export class AttendancesettingsService {
  create(createAttendancesettingDto: CreateAttendancesettingDto) {
    return 'This action adds a new attendancesetting';
  }

  findAll() {
    return `This action returns all attendancesettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendancesetting`;
  }

  update(id: number, updateAttendancesettingDto: UpdateAttendancesettingDto) {
    return `This action updates a #${id} attendancesetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendancesetting`;
  }
}
