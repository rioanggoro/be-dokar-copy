import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RegisterEmployeeService } from './register-employee.service';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';

@Controller('register-employee')
export class RegisterEmployeeController {
  constructor(
    private readonly registerEmployeeService: RegisterEmployeeService,
  ) {}

  @Post()
  @Throttle(1, 10) // Membatasi hanya 1 request per 10 detik
  async register(@Body() createRegisterEmployeeDto: CreateRegisterEmployeeDto) {
    return this.registerEmployeeService.register(createRegisterEmployeeDto);
  }
}
