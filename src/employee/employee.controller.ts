import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';


@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(3, 60) // udah berdasarkan ip user
  @Post('register')
  async register(@Body() registerEmployeeDto: RegisterEmployeeDto) {
    return this.employeeService.registerEmployee(registerEmployeeDto);
  }

  
  @Post()
  create(@Body() createEmployeeDto: RegisterEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  
  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
