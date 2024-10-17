import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonthlyAttendanceService } from './monthly_attendance.service';
import { CreateMonthlyAttendanceDto } from './dto/create-monthly_attendance.dto';
import { UpdateMonthlyAttendanceDto } from './dto/update-monthly_attendance.dto';

@Controller('monthly-attendance')
export class MonthlyAttendanceController {
  constructor(private readonly monthlyAttendanceService: MonthlyAttendanceService) {}

  @Post()
  create(@Body() createMonthlyAttendanceDto: CreateMonthlyAttendanceDto) {
    return this.monthlyAttendanceService.create(createMonthlyAttendanceDto);
  }

  @Get()
  findAll() {
    return this.monthlyAttendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monthlyAttendanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonthlyAttendanceDto: UpdateMonthlyAttendanceDto) {
    return this.monthlyAttendanceService.update(+id, updateMonthlyAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monthlyAttendanceService.remove(+id);
  }
}
