import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';




@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Endpoint untuk login
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('login')
  async login(@Body() createEmployeeDto: LoginEmployeeDto) {
    return this.employeeService.login(createEmployeeDto);
  }

  // Endpoint untuk register
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60) // udah berdasarkan ip user
  @Post('register')
  async register(@Body() registerEmployeeDto: RegisterEmployeeDto) {
    return this.employeeService.registerEmployee(registerEmployeeDto);
  }

  

  
}
