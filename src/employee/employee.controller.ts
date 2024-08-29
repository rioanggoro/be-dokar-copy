import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Endpoint untuk login
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('login')
  async login(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.login(createEmployeeDto);
  }
}
