import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeGeneralInformation } from 'src/employee/entities/employee-general-information.entity';
import { Company } from 'src/company/entities/company.entity';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';

@Injectable()
export class RegisterEmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(EmployeeGeneralInformation)
    private readonly generalInfoRepository: Repository<EmployeeGeneralInformation>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // Metode untuk registrasi karyawan baru
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
    const newGeneralInfo = this.generalInfoRepository.create({
      ...generalInformation,
      phone: employeeData.phone, // Pastikan phone dipetakan dengan benar ke GeneralInformation jika diperlukan
    });
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

  // Metode untuk memperbarui data karyawan yang sudah ada
  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    // Cari Employee berdasarkan ID
    const employee = await this.employeeRepository.findOne({
      where: { id_employee: id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Update data Employee dengan informasi baru
    Object.assign(employee, updateEmployeeDto);

    // Jika ada perubahan pada company, cari dan update relasi dengan company
    if (updateEmployeeDto.id_company) {
      const company = await this.companyRepository.findOne({
        where: { id_company: updateEmployeeDto.id_company },
      });
      if (!company) {
        throw new NotFoundException(
          `Company with ID ${updateEmployeeDto.id_company} not found`,
        );
      }
      employee.company = company;
    }

    // Jika ada perubahan pada generalInformation, cari dan update relasi dengan generalInformation
    if (updateEmployeeDto.generalInformation) {
      const generalInfoEntity = await this.generalInfoRepository.findOne({
        where: {
          id_general_information:
            employee.generalInformation.id_general_information,
        },
      });
      if (!generalInfoEntity) {
        throw new NotFoundException(
          `General Information with ID ${employee.generalInformation.id_general_information} not found`,
        );
      }
      Object.assign(generalInfoEntity, updateEmployeeDto.generalInformation);
      await this.generalInfoRepository.save(generalInfoEntity);
    }

    // Simpan perubahan dan kembalikan hasilnya
    return this.employeeRepository.save(employee);
  }
}
