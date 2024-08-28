import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneralInforamtionService } from './general_inforamtion.service';
import { CreateGeneralInforamtionDto } from './dto/create-general_inforamtion.dto';
import { UpdateGeneralInforamtionDto } from './dto/update-general_inforamtion.dto';

@Controller('general-inforamtion')
export class GeneralInforamtionController {
  constructor(private readonly generalInforamtionService: GeneralInforamtionService) {}

  @Post()
  create(@Body() createGeneralInforamtionDto: CreateGeneralInforamtionDto) {
    return this.generalInforamtionService.create(createGeneralInforamtionDto);
  }

  @Get()
  findAll() {
    return this.generalInforamtionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalInforamtionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralInforamtionDto: UpdateGeneralInforamtionDto) {
    return this.generalInforamtionService.update(+id, updateGeneralInforamtionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalInforamtionService.remove(+id);
  }
}
