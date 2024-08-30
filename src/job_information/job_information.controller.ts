import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobInformationService } from './job_information.service';
import { CreateJobInformationDto } from './dto/create-job_information.dto';
import { UpdateJobInformationDto } from './dto/update-job_information.dto';

@Controller('job-information')
export class JobInformationController {
  constructor(private readonly jobInformationService: JobInformationService) {}

  @Post()
  create(@Body() createJobInformationDto: CreateJobInformationDto) {
    return this.jobInformationService.create(createJobInformationDto);
  }

  @Get()
  findAll() {
    return this.jobInformationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobInformationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobInformationDto: UpdateJobInformationDto) {
    return this.jobInformationService.update(+id, updateJobInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobInformationService.remove(+id);
  }
}
