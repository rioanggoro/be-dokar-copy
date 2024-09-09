import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClockinService } from './clockin.service';
import { CreateClockinDto } from './dto/create-clockin.dto';
import { UpdateClockinDto } from './dto/update-clockin.dto';

@Controller('clockin')
export class ClockinController {
  constructor(private readonly clockinService: ClockinService) {}

  @Post()
  create(@Body() createClockinDto: CreateClockinDto) {
    return this.clockinService.create(createClockinDto);
  }

  @Get()
  findAll() {
    return this.clockinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clockinService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClockinDto: UpdateClockinDto) {
    return this.clockinService.update(+id, updateClockinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clockinService.remove(+id);
  }
}
