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
      const isPasswordValid = await comparePassword(
        password,
        existingEmployee.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      // Jika email sudah terdaftar dan password valid, lemparkan error
      throw new InternalServerErrorException(
        'Account is already registered, please use another account',
      );
    }

    const hashedPassword = await hashPassword(password);
    // Update kolom-kolom yang ada pada tabel employee
    employee.email = email;
    employee.password = hashedPassword;
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
      statusCode: 201,
      status: 'success',
      message: 'Register successful',
      token_auth: token_auth,
    };
  }

  catch() {
    throw new InternalServerErrorException(
      'Internal server error occurred while processing the request',
    );
  }

  async login(loginEmployeeDto: LoginEmployeeDto) {
    const { email, password } = loginEmployeeDto;

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

  async createPermissionAttendance(
    token_auth: string, // Terima token_auth dari controller
    employeePermissionAttendanceDto: PermissionAttendanceEmployeeDto,
  ): Promise<any> {
    const { id_employee, description, proof_of_attendance } =
      employeePermissionAttendanceDto;

    try {
      // Validasi input
      if (!id_employee) {
        throw new BadRequestException('Employee ID is required');
      }
      if (!token_auth) {
        throw new UnauthorizedException('Token auth is required');
      }
      if (!description) {
        throw new BadRequestException('Description is required');
      }
      if (!proof_of_attendance) {
        throw new BadRequestException('Proof of attendance is required');
      }

      // Verifikasi token auth
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
        statusCode: 200,
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
      const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid selama 5 menit
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

    Kodenya berlaku selama 5 menit.<br><br>

    Demi keamananmu, jangan berikan kodenya ke siapa pun!
  `,
      };

      await transporter.sendMail(mailOptions);

      return {
        statusCode: 200,
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
        statusCode: 200,
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
        throw new NotFoundException('Employee not found');
      }

      // Hash password baru
      const hashedPassword = await hashPassword(new_password);

      // Update password employee
      employee.password = hashedPassword;
      await this.employeeRepository.save(employee);

      return {
        statusCode: 200,
        status: 'success',
        message: 'Password has been changed successfully',
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
      // Tangani error yang tidak terduga
      throw new InternalServerErrorException('Error changing password');
    }
  }
}
