import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterEmployeeDto } from './create-register-employee.dto';

export class UpdateRegisterEmployeeDto extends PartialType(
  CreateRegisterEmployeeDto,
) {}
