import { Module } from '@nestjs/common';
import { EmployeeJobinformationCompanyService } from './employee-jobinformation-company.service';
import { EmployeeJobinformationCompanyController } from './employee-jobinformation-company.controller';

@Module({
  controllers: [EmployeeJobinformationCompanyController],
  providers: [EmployeeJobinformationCompanyService],
})
export class EmployeeJobinformationCompanyModule {}
