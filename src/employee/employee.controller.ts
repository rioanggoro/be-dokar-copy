import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { HttpExceptionFilter } from 'src/shared/filters/exception.filter';
import { EmployeeSendOtpDto } from './dto/employee-sendotp.dto';
import { EmployeeVerifyOtpDto } from './dto/employee-verifyotp.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300)
  @Post('permission-attendance')
  async createPermissionAttendance(
    @Headers('Authorization') authHeader: string,
    @Body('id_employee') id_employee: number,
    @Body('description') description: string,
    @Body('proof_of_attendance') proof_of_attendance: string,
  ) {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Token not found');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    // Lanjutkan dengan logika lainnya
    return this.employeeService.createPermissionAttendance(
      token_auth,
      id_employee,
      description,
      proof_of_attendance,
    );
  }

  // Endpoint untuk login
  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('login')
  async login(@Body() loginEmployeeDto: LoginEmployeeDto) {
    return this.employeeService.login(loginEmployeeDto);
  }

  // Endpoint untuk register
  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60) // udah berdasarkan ip user
  @Post('register')
  async register(@Body() registerEmployeeDto: RegisterEmployeeDto) {
    return this.employeeService.registerEmployee(registerEmployeeDto);
  }

  @Post('send-otp')
  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300) // Membatasi 50 permintaan per 5 menit
  @UseFilters(HttpExceptionFilter)
  async sendOTP(@Body() employeeSendOtpDto: EmployeeSendOtpDto) {
    return this.employeeService.sendOTP(employeeSendOtpDto);
  }

  @Post('verify-otp')
  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300)
  @UseFilters(HttpExceptionFilter)
  async verifyOTP(@Body() employeeVerifyDto: EmployeeVerifyOtpDto) {
    return this.employeeService.verifyOTP(employeeVerifyDto);
  }
}
