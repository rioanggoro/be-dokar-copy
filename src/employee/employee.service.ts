import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
  UnauthorizedException,
  HttpException,
  HttpStatus,
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
import { PermissionAttendance } from 'src/permission_attendance/entities/permission_attendance.entity';
import * as nodemailer from 'nodemailer';
import { SendOtpEmployeeDto } from './dto/sendotp-employee.dto';
import { VerifyOtpEmployeeDto } from './dto/verifyotp-employee.dto';
import { ChangePasswordEmployeeDto } from './dto/change_password-employee.dto';
import { PermissionAttendanceEmployeeDto } from 'src/employee/dto/permission_attendance-employee.dto';
import { CreateClockInDto } from './dto/clock_in-employee.dto';
import { ClockIn } from 'src/clockin/entities/clockin.entity';
import { ClockOut } from 'src/clockout/entities/clockout.entity';
import { CreateClockOutDto } from './dto/clock_out-employee.dto';
import { DebtRequestEmployeeDto } from './dto/debt_request-employee.dto';
import { DebtRequest } from 'src/debt_request/entities/debt_request.entity';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class EmployeeService {
  private otps: Record<string, { otp: string; expiresAt: number }> = {};
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(GeneralInforamtion)
    private generalInformationRepository: Repository<GeneralInforamtion>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(PermissionAttendance)
    private permissionAttendanceRepository: Repository<PermissionAttendance>,
    @InjectRepository(ClockIn)
    private clockInRepository: Repository<ClockIn>,
    @InjectRepository(ClockOut)
    private clockOutRepository: Repository<ClockOut>,
    @InjectRepository(DebtRequest)
    private debtRequestRepository: Repository<DebtRequest>,

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
      throw new NotFoundException('Company not found'); // Tetap di service
    }

    // Cari employee berdasarkan id_employee dan id_company
    const employee = await this.employeeRepository.findOne({
      where: { id_employee, company },
      relations: ['generalInformation'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found for this company'); // Tetap di service
    }

    // Cek apakah email sudah terdaftar untuk employee ini
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email, company },
    });

    if (existingEmployee && existingEmployee.id_employee !== id_employee) {
      // Periksa apakah password yang diberikan cocok dengan password yang tersimpan
      const isPasswordValid = await comparePassword(
        password,
        existingEmployee.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      throw new InternalServerErrorException(
        'Account is already registered, please use another account',
      );
    }

    const hashedPassword = await hashPassword(password);
    employee.email = email;
    employee.password = hashedPassword;
    employee.company = company;

    if (!employee.generalInformation) {
      throw new NotFoundException(
        'General Information not found for this employee',
      );
    }

    employee.generalInformation.phone = telephone;

    await this.employeeRepository.save(employee);
    await this.generalInformationRepository.save(employee.generalInformation);

    const payload = { email: employee.email, sub: employee.id_employee };
    const token_auth = await this.jwtService.signAsync(payload);

    employee.token_auth = token_auth;
    await this.employeeRepository.save(employee);

    return {
      statusCode: 201,
      status: 'success',
      message: 'Register successful',
      catch() {
        throw new InternalServerErrorException(
          'Internal server error occurred while processing the request',
        );
      },
    };
  }

  async login(loginEmployeeDto: LoginEmployeeDto) {
    const { email, password } = loginEmployeeDto;

    // Cari employee berdasarkan email
    const employee = await this.employeeRepository.findOne({
      where: { email },
      relations: ['jobInformation', 'company'],
    });

    if (!employee) {
      throw new InternalServerErrorException('Invalid Email');
    }

    // Periksa password
    const isPasswordValid = await comparePassword(password, employee.password);

    if (!isPasswordValid) {
      throw new InternalServerErrorException('Invalid password');
    }

    // Buat token JWT
    const token_auth = this.jwtService.sign({
      id: employee.id_employee,
      email: employee.email,
    });

    return {
      statusCode: 201,
      status: 'success',
      message: 'Login successful',
      user: {
        id_company: employee.company.id_company,
        id_employee: employee.id_employee,
        photo: employee.employee_photo,
        department: employee.jobInformation.user_department,
        token_auth,
      },
    };
  }

  async createPermissionAttendance(
    token_auth: string, // Terima token_auth dari controller
    employeePermissionAttendanceDto: PermissionAttendanceEmployeeDto,
  ): Promise<any> {
    const { id_employee, description, proof_of_attendance } =
      employeePermissionAttendanceDto;

    try {
      let decoded;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decoded = this.jwtService.verify(token_auth);
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }

      // Cari employee berdasarkan id
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
      });

      if (!employee) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          status: 'Error',
          message: 'Employee not found',
        });
      }

      // Simpan permission attendance
      const permissionAttendance = new PermissionAttendance();
      permissionAttendance.description = description;
      permissionAttendance.proof_of_attendance = proof_of_attendance;
      permissionAttendance.employee = employee;

      await this.permissionAttendanceRepository.save(permissionAttendance);
      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully sent permission attendance',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'Error',
          message: 'Error sent permission attendance',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async sendOTP(
    employeesendotpdto: SendOtpEmployeeDto,
  ): Promise<{ statusCode: number; status: string; message: string }> {
    const { email } = employeesendotpdto;

    try {
      // Cari employee berdasarkan email
      const employee = await this.employeeRepository.findOne({
        where: { email },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 2 * 60 * 1000; // OTP valid selama 2 menit
      // const expiresAt = Date.now() + 30 * 1000; // OTP valid selama 30 detik

      // Simpan OTP dan waktu kedaluwarsa dalam memori
      this.otps[email] = { otp, expiresAt };

      // Kirim email OTP
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employee.email,
        subject: 'Kode OTP Untuk Reset Password',
        html: `
    Hai, Pakai kode OTP di bawah ini untuk akunmu.<br><br>

    <span style="font-size: 24px; color: blue;">${otp}</span><br><br>

    Kodenya berlaku selama 2 menit.<br><br>

    Demi keamananmu, jangan berikan kodenya ke siapa pun!
  `,
      };

      await transporter.sendMail(mailOptions);

      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully sent OTP to email',
      };
    } catch (error) {
      console.error('Error detail:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Tangani error yang tidak terduga
      throw new InternalServerErrorException('Error send otp to email');
    }
  }

  async verifyOTP(
    employeeVerifyDto: VerifyOtpEmployeeDto,
  ): Promise<{ statusCode: number; status: string; message: string }> {
    const { email, otp } = employeeVerifyDto;

    try {
      // Validasi email dan OTP
      if (!email) {
        throw new BadRequestException('Email is required');
      }
      if (!otp) {
        throw new BadRequestException('OTP is required');
      }

      // Cari employee berdasarkan email
      const employee = await this.employeeRepository.findOne({
        where: { email },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Periksa OTP yang tersimpan
      const record = this.otps[email];

      if (!record) {
        throw new NotFoundException('OTP not found or already used');
      }

      // Validasi apakah OTP telah kedaluwarsa
      if (record.expiresAt < Date.now()) {
        delete this.otps[email]; // Hapus OTP yang kedaluwarsa
        throw new UnauthorizedException('OTP has expired');
      }

      // Ubah OTP yang diterima menjadi string
      if (record.otp !== otp.toString()) {
        console.log('Invalid OTP');
        throw new UnauthorizedException('Invalid OTP');
      }

      // Hapus OTP setelah verifikasi sukses
      delete this.otps[email];

      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully verified OTP',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Tangani error yang tidak terduga
      throw new InternalServerErrorException('Error verifying OTP');
    }
  }

  async changePassword(
    employeeChangePasswordDto: ChangePasswordEmployeeDto,
  ): Promise<{ statusCode: number; status: string; message: string }> {
    const { email, new_password } = employeeChangePasswordDto;

    try {
      // Cari employee berdasarkan email
      const employee = await this.employeeRepository.findOne({
        where: { email },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found'); // Pengecekan employee di service
      }

      // Cek apakah password baru sama dengan password lama
      const isOldPasswordValid = await comparePassword(
        new_password,
        employee.password,
      );
      if (isOldPasswordValid) {
        throw new BadRequestException(
          'New password cannot be the same as the old password',
        );
      }

      // Hash password baru
      const hashedPassword = await hashPassword(new_password);

      // Update password employee
      employee.password = hashedPassword;
      await this.employeeRepository.save(employee);

      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully changed password',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Tangani error yang tidak terduga dan log error internal untuk debugging
      console.error('Error changing password:', error);
      throw new InternalServerErrorException('Error changing password');
    }
  }
  // Fungsi baru untuk create clock-in
  async createClockIn(
    token_auth: string, // Terima token_auth dari controller
    createClockInDto: CreateClockInDto,
  ): Promise<any> {
    const { id_employee, address, latitude, longitude, photo, date, time } =
      createClockInDto;

    try {
      let decoded;
      try {
        // Verifikasi token
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decoded = this.jwtService.verify(token_auth);
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['company'], // Pastikan mengambil data company juga
      });

      if (!employee) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          status: 'Error',
          message: 'Employee not found',
        });
      }

      // Ambil informasi perusahaan
      const company = employee.company;
      if (!company) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          status: 'Error',
          message: 'Company not found for this employee',
        });
      }

      // Fungsi untuk menghitung jarak menggunakan formula Haversine
      function calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
      ): number {
        const R = 6371000; // Radius bumi dalam meter
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Jarak dalam meter
        return distance;
      }

      // Hitung jarak antara lokasi clock-in dan lokasi perusahaan
      const distance = calculateDistance(
        company.latitude,
        company.longitude,
        latitude,
        longitude,
      );

      // Periksa apakah jarak dalam radius yang diizinkan (misal radius dalam meter)
      if (distance > company.set_radius) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Error',
          message: `Clock-in location is outside the allowed radius (${company.set_radius} meters)`,
        });
      }

      // Simpan clock-in jika jarak dalam radius
      const clockIn = new ClockIn();
      clockIn.address = address;
      clockIn.latitude = latitude;
      clockIn.longitude = longitude;
      clockIn.attendance_photo = photo;
      clockIn.created_at = date;
      clockIn.time = time;
      clockIn.employee = employee;

      await this.clockInRepository.save(clockIn);

      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully clock in',
        // radius: company.set_radius,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'Error',
          message: 'Error clock in',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Fungsi baru untuk create clock-out
  async createClockOut(
    token_auth: string, // Terima token_auth dari controller
    createClockOutDto: CreateClockOutDto,
  ): Promise<any> {
    const { id_employee, address, latitude, longitude, photo, date, time } =
      createClockOutDto;

    try {
      console.log('Verifying token...');
      let decoded;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decoded = this.jwtService.verify(token_auth);
      } catch (error) {
        console.error('Token verification failed:', error.message);
        throw new UnauthorizedException('Invalid token');
      }

      console.log(`Fetching employee with id: ${id_employee}`);

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['company'], // Pastikan mengambil data company juga
      });

      if (!employee) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          status: 'Error',
          message: 'Employee not found',
        });
      }

      // Ambil informasi perusahaan
      const company = employee.company;
      if (!company) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          status: 'Error',
          message: 'Company not found for this employee',
        });
      }

      // Fungsi untuk menghitung jarak menggunakan formula Haversine
      function calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
      ): number {
        const R = 6371000; // Radius bumi dalam meter
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Jarak dalam meter
        return distance;
      }

      // Hitung jarak antara lokasi clock-out dan lokasi perusahaan
      const distance = calculateDistance(
        company.latitude,
        company.longitude,
        latitude,
        longitude,
      );

      // Periksa apakah jarak dalam radius yang diizinkan (misal radius dalam meter)
      if (distance > company.set_radius) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Error',
          message: `Clock-out location is outside the allowed radius (${company.set_radius} meters)`,
        });
      }

      // Simpan clock-out jika jarak dalam radius
      const clockOut = new ClockOut();
      clockOut.address = address;
      clockOut.latitude = latitude;
      clockOut.longitude = longitude;
      clockOut.attendance_photo = photo;
      clockOut.created_at = date;
      clockOut.time = time;
      clockOut.employee = employee;

      await this.clockOutRepository.save(clockOut);
      console.log('Clock-out record saved successfully');

      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully clock out',
        // radius: company.set_radius,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'Error',
          message: 'Error clock out',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Fungsi baru untuk create debt request
  async debtRequest(
    token_auth: string, // Terima token_auth dari controller
    debtRequestEmployeeDto: DebtRequestEmployeeDto, // DTO yang sudah divalidasi
  ): Promise<any> {
    const {
      id_employee,
      nominal_request,
      bank_name,
      account_name,
      account_number,
      borrowing_cost,
      admin_fee,
      grand_total_request,
    } = debtRequestEmployeeDto;

    try {
      let decoded;
      try {
        // Verifikasi token JWT
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decoded = this.jwtService.verify(token_auth);
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['debtRequests'], // Pastikan untuk mengambil relasi debtRequests sebelumnya
      });

      if (!employee) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          status: 'Error',
          message: 'Employee not found',
        });
      }

      // Hitung remaining_saldo_debt secara dinamis
      let previous_saldo = 350000;

      // Periksa apakah ada permintaan hutang sebelumnya
      if (employee.debtRequests && employee.debtRequests.length > 0) {
        // Ambil saldo kasbon dari permintaan hutang terakhir
        const lastDebtRequest =
          employee.debtRequests[employee.debtRequests.length - 1];
        previous_saldo = lastDebtRequest.remaining_saldo_debt;
      }

      // Kurangi nominal_request dari saldo kasbon sebelumnya
      const remaining_saldo_debt = previous_saldo - grand_total_request;

      // Buat objek DebtRequest baru dan isi dengan data dari DTO
      const debtRequest = new DebtRequest();
      debtRequest.employee = employee; // Hubungkan debt request dengan employee
      debtRequest.nominal_request = nominal_request;
      debtRequest.bank_name = bank_name;
      debtRequest.account_name = account_name;
      debtRequest.account_number = account_number;
      debtRequest.borrowing_cost = borrowing_cost;
      debtRequest.admin_fee = admin_fee;
      debtRequest.grand_total_request = grand_total_request;
      debtRequest.remaining_saldo_debt = remaining_saldo_debt; // Saldo kasbon yang tersisa
      debtRequest.status = 'Pending'; // Set status default menjadi "Pending"

      // Simpan DebtRequest ke dalam database
      await this.debtRequestRepository.save(debtRequest);

      // Kembalikan respons sukses
      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully created debt request',
        debtRequestId: debtRequest.id_debt_request,
        remaining_saldo_debt: remaining_saldo_debt, // Sertakan saldo kasbon yang tersisa dalam respons
      };
    } catch (error) {
      // Tangani error lain
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      // Tangani error internal
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'Error',
          message: 'Error creating debt request',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
