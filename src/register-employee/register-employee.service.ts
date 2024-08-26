import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeGeneralInformation } from 'src/employee/entities/employee-general-information.entity';
import { Company } from 'src/company/entities/company.entity'; // Tambahkan import untuk Company
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';

@Injectable()
export class RegisterEmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(EmployeeGeneralInformation)
    private readonly generalInfoRepository: Repository<EmployeeGeneralInformation>,

    @InjectRepository(Company) // Tambahkan repository untuk Company
    private readonly companyRepository: Repository<Company>,
  ) {}

  async register(
    createRegisterEmployeeDto: CreateRegisterEmployeeDto,
  ): Promise<Employee> {
    const { id_company, generalInformation, ...employeeData } =
      createRegisterEmployeeDto;

    // Cari Company berdasarkan id_company
    const company = await this.companyRepository.findOne({
      where: { id_company },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id_company} not found`);
    }

    // Simpan data GeneralInformation terlebih dahulu
    const newGeneralInfo =
      this.generalInfoRepository.create(generalInformation);
    const savedGeneralInfo =
      await this.generalInfoRepository.save(newGeneralInfo);

    // Kemudian simpan data Employee, dengan relasi ke GeneralInformation dan Company
    const newEmployee = this.employeeRepository.create({
      ...employeeData,
      generalInformation: savedGeneralInfo, // Relasi dengan GeneralInformation
      company: company, // Relasi dengan Company
    });

    // Menyimpan entitas Employee dan mengembalikan hasilnya
    return await this.employeeRepository.save(newEmployee);
  }
}
