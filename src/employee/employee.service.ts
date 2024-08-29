import {
  HttpException,
  HttpStatus,
  Injectable,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { JobInformation } from 'src/job_information/entities/job_information.entity';
import { Company } from 'src/company/entities/company.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { HttpExceptionFilter } from 'src/shared/filters/exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(JobInformation)
    private jobInformationRepository: Repository<JobInformation>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService, // Injeksi JwtService
  ) {}

  async login(createEmployeeDto: CreateEmployeeDto) {
    const { email, password } = createEmployeeDto;

    // Cari employee berdasarkan email
    const employee = await this.employeeRepository.findOne({
      where: { email },
      relations: ['jobInformation', 'company'],
    });

    if (!employee || employee.password !== password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'Error',
          message: 'Invalid username or password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
