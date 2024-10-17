import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TotalMonthlyAttendanceService } from './pay-slip.service';
import { CreatePaySlipDto } from './dto/create-pay-slip.dto';
import { UpdatePaySlipDto } from './dto/update-pay-slip.dto';

@Controller('total-monthly-attendance')
export class TotalMonthlyAttendanceController {
  constructor(
    private readonly totalMonthlyAttendanceService: TotalMonthlyAttendanceService,
  ) {}

  @Post()
  create(@Body() createTotalMonthlyAttendanceDto: CreatePaySlipDto) {
    return this.totalMonthlyAttendanceService.create(
      createTotalMonthlyAttendanceDto,
    );
  }

  @Get()
  findAll() {
    return this.totalMonthlyAttendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.totalMonthlyAttendanceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTotalMonthlyAttendanceDto: UpdatePaySlipDto,
  ) {
    return this.totalMonthlyAttendanceService.update(
      +id,
      updateTotalMonthlyAttendanceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.totalMonthlyAttendanceService.remove(+id);
  }
}
