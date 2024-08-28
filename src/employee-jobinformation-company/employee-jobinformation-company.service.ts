import { Injectable } from '@nestjs/common';
import { CreateEmployeeJobinformationCompanyDto } from './dto/create-employee-jobinformation-company.dto';
import { UpdateEmployeeJobinformationCompanyDto } from './dto/update-employee-jobinformation-company.dto';

@Injectable()
export class EmployeeJobinformationCompanyService {
  create(createEmployeeJobinformationCompanyDto: CreateEmployeeJobinformationCompanyDto) {
    return 'This action adds a new employeeJobinformationCompany';
  }

  findAll() {
    return `This action returns all employeeJobinformationCompany`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employeeJobinformationCompany`;
  }

  update(id: number, updateEmployeeJobinformationCompanyDto: UpdateEmployeeJobinformationCompanyDto) {
    return `This action updates a #${id} employeeJobinformationCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} employeeJobinformationCompany`;
  }
}
