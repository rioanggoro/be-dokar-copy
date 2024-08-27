import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterEmployeeDto } from 'src/register-employee/dto/create-register-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateRegisterEmployeeDto) {
  id_employee: number;
}
