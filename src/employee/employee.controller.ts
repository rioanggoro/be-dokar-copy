import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  UseFilters,
  UnauthorizedException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
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
import { CreateClockInDto } from './dto/clock_in-employee.dto';
import { CreateClockOutDto } from './dto/clock_out-employee.dto';
import { DebtRequestEmployeeDto } from './dto/debt_request-employee.dto';
import { GetGeneralInformationEmployeeDto } from './dto/get_general_information-employee.dto';
import { EditGeneralInformationEmployeeDto } from './dto/edit_general_information-employee.dto';
import { GetPersonalInformationEmployeeDto } from './dto/get_personal_information.dto';
import { EditPersonalInformationEmployeeDto } from './dto/edit_personal_information-employee.dto';
import { LogoutEmployeeDto } from './dto/logout-employee.dto';
import { GetCardAssuranceEmployeeDto } from './dto/get_card-assurance-employee.dto';
import { GetJobInformationEmployeeDto } from './dto/get_job_information-employee.dto';
import { DebtDetailEmployeelDto } from './dto/debt_detail-employee.dto';
import { PermissionAttendanceDetailEmployeeDto } from './dto/permission_attendance_detail-employee.dto';
import { DebtHistoryEmployeeDto } from './dto/debt_history-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('employee')
export class EmployeeController {
  jwtService: any;
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('permission_attendance')
  async createPermissionAttendance(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() employeePermissionAttendanceDto: PermissionAttendanceEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
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
  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('login')
  @UseFilters(HttpExceptionFilter)
  async login(@Body() loginEmployeeDto: LoginEmployeeDto) {
    return this.employeeService.login(loginEmployeeDto);
  }

  // Endpoint untuk register
  @UseFilters(HttpExceptionFilter)
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
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('clockin')
  async createClockIn(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() createClockInDto: CreateClockInDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk melakukan operasi createClockIn dengan DTO dan token
    return this.employeeService.createClockIn(
      token_auth, // Teruskan token ke service
      createClockInDto,
    );
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('clockout')
  async createClockOut(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() createClockOutDto: CreateClockOutDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk melakukan operasi createClockIn dengan DTO dan token
    return this.employeeService.createClockOut(
      token_auth, // Teruskan token ke service
      createClockOutDto,
    );
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('debt/request')
  async createDebtRequest(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() debtRequestEmployeeDto: DebtRequestEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk membuat permintaan hutang dengan DTO dan token
    return this.employeeService.debtRequest(token_auth, debtRequestEmployeeDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('general-information/get')
  async getGeneralInformation(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() getGeneralInformationEmployeeDto: GetGeneralInformationEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk mengambil general information dengan DTO dan token
    return this.employeeService.getGeneralInformation(
      token_auth,
      getGeneralInformationEmployeeDto,
    );
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('general-information/edit')
  async editGeneralInformation(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body()
    editGeneralInformation: EditGeneralInformationEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk mengambil general information dengan DTO dan token
    return this.employeeService.editGeneralInformation(
      token_auth,
      editGeneralInformation,
    );
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('personal-information/get')
  async getPersonalInformation(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body()
    getPersonalInformationEmployeeDto: GetPersonalInformationEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk mengambil general information dengan DTO dan token
    return this.employeeService.getPersonalInformation(
      token_auth,
      getPersonalInformationEmployeeDto,
    );
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @UseFilters(HttpExceptionFilter)
  @Post('personal-information/edit')
  async editPersonalInformation(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body()
    editPersonalInformation: EditPersonalInformationEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk mengambil general information dengan DTO dan token
    return this.employeeService.editPersonalInformation(
      token_auth,
      editPersonalInformation,
    );
  }

  // Endpoint untuk logout
  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('logout')
  async logout(
    @Headers('Authorization') authHeader: string,
    @Body() logoutEmployeeDto: LogoutEmployeeDto,
  ): Promise<any> {
    // Cek apakah ada Authorization header
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    // Ekstrak token dari Authorization header
    const token_auth = authHeader.split(' ')[1];

    // Cek apakah token ada setelah Bearer
    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk proses logout
    return this.employeeService.logout(token_auth, logoutEmployeeDto);
  }

  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('/assurance/get')
  async getAssuranceCard(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() getCardAssuranceEmployeeDto: GetCardAssuranceEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk mengambil general information dengan DTO dan token
    return this.employeeService.getCardAssurance(
      token_auth,
      getCardAssuranceEmployeeDto,
    );
  }

  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('/edit_photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads', // Folder tempat menyimpan file
        filename: (req, file, cb) => {
          // Menyimpan file dengan nama unik
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async editPhoto(
    @Headers('Authorization') authHeader: string, // Ambil header Authorization
    @UploadedFile() file: Express.Multer.File, // Ambil file yang diupload
    @Body() body: any, // Body dari request
  ): Promise<any> {
    // Cek apakah Authorization header ada
    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing');
    }

    // Ambil token dari Authorization header
    const token_auth = authHeader.split(' ')[1];

    // Pastikan file ada
    if (!file) {
      throw new BadRequestException('Photo is required');
    }

    // Path tempat menyimpan file
    const filePath = `/uploads/${file.filename}`;

    // Kirim path file (bukan file itu sendiri) ke service
    const result = await this.employeeService.editPhoto(token_auth, {
      ...body, // Gabungkan data dari body
      photo: filePath, // Sertakan path foto yang di-upload
    });

    return result;
  }

  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('/job_information/get')
  async getJobInformation(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() getJobInformationEmployeeDto: GetJobInformationEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk melakukan operasi createPermissionAttendance dengan DTO dan token
    return this.employeeService.getJobInformation(
      token_auth, // Teruskan token ke service
      getJobInformationEmployeeDto,
    );
  }

  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('/debt/detail')
  async debtDetail(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body() getDebtDetaiDto: DebtDetailEmployeelDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk melakukan operasi createPermissionAttendance dengan DTO dan token
    return this.employeeService.getDebtDetail(
      token_auth, // Teruskan token ke service
      getDebtDetaiDto,
    );
  }

  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('/permission_attendance/detail')
  async permissionAttendanceDetail(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body()
    permissionAttendanceDetailDto: PermissionAttendanceDetailEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk melakukan operasi createPermissionAttendance dengan DTO dan token
    return this.employeeService.permissionAttendanceDetail(
      token_auth, // Teruskan token ke service
      permissionAttendanceDetailDto,
    );
  }

  @UseFilters(HttpExceptionFilter)
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('/debt/history')
  async debtHistory(
    @Headers('Authorization') authHeader: string, // Ambil Bearer Token dari header
    @Body()
    debtHistoryEmployeeDto: DebtHistoryEmployeeDto,
  ): Promise<any> {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Missing Token');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    if (!token_auth) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Panggil service untuk melakukan operasi createPermissionAttendance dengan DTO dan token
    return this.employeeService.debtHistory(
      token_auth, // Teruskan token ke service
      debtHistoryEmployeeDto,
    );
  }
}
