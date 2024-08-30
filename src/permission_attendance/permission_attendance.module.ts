import { Module } from '@nestjs/common';
import { PermissionAttendanceService } from './permission_attendance.service';
import { PermissionAttendanceController } from './permission_attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionAttendance } from './entities/permission_attendance.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionAttendance, Employee])],
  controllers: [PermissionAttendanceController],
  providers: [PermissionAttendanceService],
})
export class PermissionAttendanceModule {}
