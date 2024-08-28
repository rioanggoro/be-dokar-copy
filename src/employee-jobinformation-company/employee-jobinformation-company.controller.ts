import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeJobinformationCompanyService } from './employee-jobinformation-company.service';
import { CreateEmployeeJobinformationCompanyDto } from './dto/create-employee-jobinformation-company.dto';
import { UpdateEmployeeJobinformationCompanyDto } from './dto/update-employee-jobinformation-company.dto';

@Controller('employee-jobinformation-company')
export class EmployeeJobinformationCompanyController {
  constructor(private readonly employeeJobinformationCompanyService: EmployeeJobinformationCompanyService) {}

  @Post()
  create(@Body() createEmployeeJobinformationCompanyDto: CreateEmployeeJobinformationCompanyDto) {
    return this.employeeJobinformationCompanyService.create(createEmployeeJobinformationCompanyDto);
  }

  @Get()
  findAll() {
    return this.employeeJobinformationCompanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeJobinformationCompanyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeJobinformationCompanyDto: UpdateEmployeeJobinformationCompanyDto) {
    return this.employeeJobinformationCompanyService.update(+id, updateEmployeeJobinformationCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeJobinformationCompanyService.remove(+id);
  }
}
