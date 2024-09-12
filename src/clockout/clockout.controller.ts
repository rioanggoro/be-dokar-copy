import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClockoutService } from './clockout.service';
import { CreateClockoutDto } from './dto/create-clockout.dto';
import { UpdateClockoutDto } from './dto/update-clockout.dto';

@Controller('clockout')
export class ClockoutController {
  constructor(private readonly clockoutService: ClockoutService) {}

  @Post()
  create(@Body() createClockoutDto: CreateClockoutDto) {
    return this.clockoutService.create(createClockoutDto);
  }

  @Get()
  findAll() {
    return this.clockoutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clockoutService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClockoutDto: UpdateClockoutDto) {
    return this.clockoutService.update(+id, updateClockoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clockoutService.remove(+id);
  }
}
