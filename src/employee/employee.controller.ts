import { Controller, Post, Body } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Endpoint untuk login
  @Post('login')
  async login(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.login(createEmployeeDto);
  }
}
