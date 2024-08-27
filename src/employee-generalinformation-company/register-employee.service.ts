import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Repository } from 'typeorm';
import { EmployeeGeneralInformation } from 'src/employee_general_information/entities/employee-general-information.entity';
import { CreateRegisterEmployeeDto } from 'src/employee-generalinformation-company/dto/create-register-employee.dto';
import { Company } from 'src/company/entities/company.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterEmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeGeneralInformation)
    private generalInformationRepository: Repository<EmployeeGeneralInformation>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService, // Injeksi JwtService
  ) {}

  async registerEmployee(
    registerEmployeeDto: CreateRegisterEmployeeDto,
  ): Promise<any> {
    const { id_company, id_employee, email, password, telephone } =
      registerEmployeeDto;

    // Cek apakah id_company valid
    const company = await this.companyRepository.findOne({
      where: { id_company: id_company },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Cek apakah email sudah terdaftar
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email },
    });

    if (existingEmployee) {
      throw new InternalServerErrorException({
        statusCode: 500,
        status: 'Error',
        message: 'Account is already registered, please use another account',
      });
    }

    // Cari employee berdasarkan id_company dan id_employee
    const employee = await this.employeeRepository.findOne({
      where: { company, id_employee },
      relations: ['generalInformation'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Update kolom-kolom yang ada pada tabel employee
    employee.email = email;
    employee.password = password;
    employee.company = company; // Assign company

    // Pastikan generalInformation tidak undefined
    if (!employee.generalInformation) {
      throw new NotFoundException(
        'General Information not found for this employee',
      );
    }

    // Update general_information table
    employee.generalInformation.phone = telephone;

    // Simpan perubahan
    await this.employeeRepository.save(employee);
    await this.generalInformationRepository.save(employee.generalInformation);

    // Generate JWT token
    const payload = { email: employee.email, sub: employee.id_employee };
    const token_auth = await this.jwtService.signAsync(payload);

    employee.token_auth = token_auth;
    await this.employeeRepository.save(employee);

    // Mengembalikan response sukses beserta token
    return {
      statusCode: 200,
      status: 'success',
      message: 'Register successful',
      token_auth: token_auth,
    };
  }

  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
