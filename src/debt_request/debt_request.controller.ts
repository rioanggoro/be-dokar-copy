import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DebtRequestService } from './debt_request.service';
import { CreateDebtRequestDto } from './dto/create-debt_request.dto';
import { UpdateDebtRequestDto } from './dto/update-debt_request.dto';

@Controller('debt-request')
export class DebtRequestController {
  constructor(private readonly debtRequestService: DebtRequestService) {}

  @Post()
  create(@Body() createDebtRequestDto: CreateDebtRequestDto) {
    return this.debtRequestService.create(createDebtRequestDto);
  }

  @Get()
  findAll() {
    return this.debtRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtRequestDto: UpdateDebtRequestDto) {
    return this.debtRequestService.update(+id, updateDebtRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtRequestService.remove(+id);
  }
}
