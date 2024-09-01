import { Injectable } from '@nestjs/common';
import { CreatePermissionAttendanceDto } from './dto/create-permission_attendance.dto';
import { UpdatePermissionAttendanceDto } from './dto/update-permission_attendance.dto';

@Injectable()
export class PermissionAttendanceService {
  create(createPermissionAttendanceDto: CreatePermissionAttendanceDto) {
    return 'This action adds a new permissionAttendance';
  }

  findAll() {
    return `This action returns all permissionAttendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissionAttendance`;
  }

  update(id: number, updatePermissionAttendanceDto: UpdatePermissionAttendanceDto) {
    return `This action updates a #${id} permissionAttendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissionAttendance`;
  }
}
