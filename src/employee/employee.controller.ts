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
import { SendOtpEmployeeDto } from './dto/sendotp-employee.dto';
import { VerifyOtpEmployeeDto } from './dto/verifyotp-employee.dto';
import { ChangePasswordEmployeeDto } from './dto/change_password-employee.dto';
import { PermissionAttendanceEmployeeDto } from './dto/permission_attendance-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300)
  @Post('permission-attendance')
  async createPermissionAttendance(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() employeePermissionAttendanceDto: PermissionAttendanceEmployeeDto,
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
  @UseFilters(HttpExceptionFilter)
  async login(@Body() loginEmployeeDto: LoginEmployeeDto) {
    return this.employeeService.login(loginEmployeeDto);
  }

  // Endpoint untuk register
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60) // udah berdasarkan ip user
  @Post('register')
  @UseFilters(HttpExceptionFilter)
  async register(@Body() registerEmployeeDto: RegisterEmployeeDto) {
    return this.employeeService.registerEmployee(registerEmployeeDto);
  }

  @Post('send-otp')
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  async sendOTP(@Body() employeesendotpdto: SendOtpEmployeeDto) {
    return this.employeeService.sendOTP(employeesendotpdto);
  }

  @Post('verify-otp')
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  async verifyOTP(@Body() employeeVerifyDto: VerifyOtpEmployeeDto) {
    return this.employeeService.verifyOTP(employeeVerifyDto);
  }

  @Post('change-password')
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  async changePassword(
    @Body() employeeChangePasswordDto: ChangePasswordEmployeeDto,
  ) {
    return this.employeeService.changePassword(employeeChangePasswordDto);
  }
}
