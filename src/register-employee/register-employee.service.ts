import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeGeneralInformation } from 'src/employee/entities/employee-general-information.entity';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';

@Injectable()
export class RegisterEmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,

    @InjectRepository(EmployeeGeneralInformation)
    private generalInfoRepository: Repository<EmployeeGeneralInformation>,
  ) {}

  async register(
    createRegisterEmployeeDto: CreateRegisterEmployeeDto,
  ): Promise<Employee> {
    const { generalInformation, ...employeeData } = createRegisterEmployeeDto;

    // Simpan data GeneralInformation terlebih dahulu
    const newGeneralInfo =
      this.generalInfoRepository.create(generalInformation);
    const savedGeneralInfo =
      await this.generalInfoRepository.save(newGeneralInfo);

    // Kemudian simpan data Employee, dengan relasi ke GeneralInformation
    const newEmployee = this.employeeRepository.create({
      ...employeeData,
      generalInformation: savedGeneralInfo, // relasi dengan GeneralInformation
    });

    // Menyimpan entitas Employee dan memeriksa jika return adalah array
    const savedEmployee = await this.employeeRepository.save(newEmployee);
    return Array.isArray(savedEmployee) ? savedEmployee[0] : savedEmployee;
  }
}
