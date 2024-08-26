import { Controller, Post, Body } from '@nestjs/common';
import { RegisterEmployeeService } from './register-employee.service';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';

@Controller('register-employee')
export class RegisterEmployeeController {
  constructor(
    private readonly registerEmployeeService: RegisterEmployeeService,
  ) {}

  @Post()
  async register(@Body() createRegisterEmployeeDto: CreateRegisterEmployeeDto) {
    return this.registerEmployeeService.register(createRegisterEmployeeDto);
  }
}
