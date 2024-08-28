import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeJobinformationCompanyDto } from './create-employee-jobinformation-company.dto';

export class UpdateEmployeeJobinformationCompanyDto extends PartialType(CreateEmployeeJobinformationCompanyDto) {}
