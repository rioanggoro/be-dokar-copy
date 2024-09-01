import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionAttendanceService } from './permission_attendance.service';
import { CreatePermissionAttendanceDto } from './dto/create-permission_attendance.dto';
import { UpdatePermissionAttendanceDto } from './dto/update-permission_attendance.dto';

@Controller('permission-attendance')
export class PermissionAttendanceController {
  constructor(
    private readonly permissionAttendanceService: PermissionAttendanceService,
  ) {}

  @Post()
  create(@Body() createPermissionAttendanceDto: CreatePermissionAttendanceDto) {
    return this.permissionAttendanceService.create(
      createPermissionAttendanceDto,
    );
  }

  @Get()
  findAll() {
    return this.permissionAttendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionAttendanceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionAttendanceDto: UpdatePermissionAttendanceDto,
  ) {
    return this.permissionAttendanceService.update(
      +id,
      updatePermissionAttendanceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionAttendanceService.remove(+id);
  }
}
