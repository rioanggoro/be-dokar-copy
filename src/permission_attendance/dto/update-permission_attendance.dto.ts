import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionAttendanceDto } from './create-permission_attendance.dto';

export class UpdatePermissionAttendanceDto extends PartialType(CreatePermissionAttendanceDto) {}
