import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  UseFilters,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { HttpExceptionFilter } from 'src/shared/filters/exception.filter';
import { EmployeeSendOtpDto } from './dto/employee-sendotp.dto';
import { EmployeeVerifyOtpDto } from './dto/employee-verifyotp.dto';
import { EmployeeChangePasswordDto } from './dto/employee-change-password.dto';
import { EmployeePermissionAttendanceDto } from './dto/employee-permissionattendance.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300)
  @Post('permission-attendance')
  async createPermissionAttendance(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() employeePermissionAttendanceDto: EmployeePermissionAttendanceDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Token not found');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk melakukan operasi createPermissionAttendance dengan DTO dan token
    return this.employeeService.createPermissionAttendance(
      token_auth, // Teruskan token ke service
      employeePermissionAttendanceDto,
    );
  }

  // Endpoint untuk login
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('login')
  async login(@Body() loginEmployeeDto: LoginEmployeeDto) {
    return this.employeeService.login(loginEmployeeDto);
  }

  // Endpoint untuk register
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60) // udah berdasarkan ip user
  @Post('register')
  async register(@Body() registerEmployeeDto: RegisterEmployeeDto) {
    return this.employeeService.registerEmployee(registerEmployeeDto);
  }

  @Post('send-otp')
  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300)
  @UseFilters(HttpExceptionFilter)
  async sendOTP(@Body() employeesendotpdto: EmployeeSendOtpDto) {
    return this.employeeService.sendOTP(employeesendotpdto);
  }

  @Post('verify-otp')
  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300)
  @UseFilters(HttpExceptionFilter)
  async verifyOTP(@Body() employeeVerifyDto: EmployeeVerifyOtpDto) {
    return this.employeeService.verifyOTP(employeeVerifyDto);
  }

  @Post('change-password')
  @UseGuards(ThrottlerGuard)
  @Throttle(50, 60)
  @UseFilters(HttpExceptionFilter)
  async changePassword(
    @Body() employeeChangePasswordDto: EmployeeChangePasswordDto,
  ) {
    return this.employeeService.changePassword(employeeChangePasswordDto);
  }
}
