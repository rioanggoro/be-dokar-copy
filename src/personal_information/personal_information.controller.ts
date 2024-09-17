import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonalInformationService } from './personal_information.service';
import { CreatePersonalInformationDto } from './dto/create-personal_information.dto';
import { UpdatePersonalInformationDto } from './dto/update-personal_information.dto';

@Controller('personal-information')
export class PersonalInformationController {
  constructor(private readonly personalInformationService: PersonalInformationService) {}

  @Post()
  create(@Body() createPersonalInformationDto: CreatePersonalInformationDto) {
    return this.personalInformationService.create(createPersonalInformationDto);
  }

  @Get()
  findAll() {
    return this.personalInformationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personalInformationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonalInformationDto: UpdatePersonalInformationDto) {
    return this.personalInformationService.update(+id, updatePersonalInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personalInformationService.remove(+id);
  }
}
