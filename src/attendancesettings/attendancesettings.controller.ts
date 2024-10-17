import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendancesettingsService } from './attendancesettings.service';
import { CreateAttendancesettingDto } from './dto/create-attendancesetting.dto';
import { UpdateAttendancesettingDto } from './dto/update-attendancesetting.dto';

@Controller('attendancesettings')
export class AttendancesettingsController {
  constructor(private readonly attendancesettingsService: AttendancesettingsService) {}

  @Post()
  create(@Body() createAttendancesettingDto: CreateAttendancesettingDto) {
    return this.attendancesettingsService.create(createAttendancesettingDto);
  }

  @Get()
  findAll() {
    return this.attendancesettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesettingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendancesettingDto: UpdateAttendancesettingDto) {
    return this.attendancesettingsService.update(+id, updateAttendancesettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancesettingsService.remove(+id);
  }
}
