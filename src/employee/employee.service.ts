import {
  BadRequestException, Injectable, InternalServerErrorException, NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Company } from 'src/company/entities/company.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from 'src/shared/filters/exception.filter';
import { GeneralInforamtion } from 'src/general_inforamtion/entities/general_inforamtion.entity';
import { comparePassword, hashPassword } from 'src/shared/utils/hash.util';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';


@Injectable()
@UseFilters(HttpExceptionFilter)
export class EmployeeService {

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(GeneralInforamtion)
    private generalInformationRepository: Repository<GeneralInforamtion>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,      
    private jwtService: JwtService, // Injeksi JwtService
  ) {}

  async registerEmployee(
    registerEmployeeDto: RegisterEmployeeDto,
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

    // Cari employee berdasarkan id_employee dan id_company
    const employee = await this.employeeRepository.findOne({
      where: { id_employee, company },
      relations: ['generalInformation'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found for this company');
    }

    // Cek apakah email sudah terdaftar untuk employee ini
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email, company },
    });

    if (existingEmployee && existingEmployee.id_employee !== id_employee) {
      // Periksa apakah password yang diberikan cocok dengan password yang tersimpan
      const isPasswordValid = await comparePassword(password, existingEmployee.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      // Jika email sudah terdaftar dan password valid, lemparkan error
      throw new InternalServerErrorException('Account is already registered, please use another account');
    }

    const hashedPassword = await hashPassword(password);
    // Update kolom-kolom yang ada pada tabel employee
    employee.email = email;
    employee.password = hashedPassword;
    employee.company = company; // Assign company

    // Pastikan generalInformation tidak undefined
    if (!employee.generalInformation) {
      throw new NotFoundException('General Information not found for this employee');
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
      statusCode: 201,
      status: 'success',
      message: 'Register successful',
      token_auth: token_auth,
    };
  }

  catch() {
    throw new InternalServerErrorException('Internal server error occurred while processing the request');
  }

 

  async login(createEmployeeDto: LoginEmployeeDto) {
    const { email, password } = createEmployeeDto;

    // Cari employee berdasarkan email
    const employee = await this.employeeRepository.findOne({
      where: { email },
      relations: ['jobInformation', 'company'],
    });

    if (!employee) {
      throw new InternalServerErrorException('Invalid username or password');
    }

    // Periksa password
    const isPasswordValid = await comparePassword(password, employee.password);

    if (!isPasswordValid) {
      throw new InternalServerErrorException('Invalid username or password');
    }

    // Buat token JWT
    const token_auth = this.jwtService.sign({
      id: employee.id_employee,
      email: employee.email,
    });

    return {
      statusCode: 200,
      status: 'success',
      message: 'Login successful',
      user: {
        id_company: employee.company.id_company,
        id_employee: employee.id_employee,
        photo: employee.employee_photo,
        department: employee.jobInformation.user_department,
        // token_device,
        token_auth,
      },
    };
  }
}
