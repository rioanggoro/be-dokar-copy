import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { RegisterEmployeeService } from './register-employee.service';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';

@Controller('register')
export class RegisterEmployeeController {
  constructor(
    private readonly registerEmployeeService: RegisterEmployeeService,
  ) {}

  @Post()
  async register(@Body() createRegisterEmployeeDto: CreateRegisterEmployeeDto) {
    return this.registerEmployeeService.register(createRegisterEmployeeDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.registerEmployeeService.update(id, updateEmployeeDto);
  }
}
