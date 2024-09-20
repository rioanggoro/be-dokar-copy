import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Company } from 'src/company/entities/company.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from 'src/shared/filters/exception.filter';
import { GeneralInformation } from 'src/general_inforamtion/entities/general_inforamtion.entity';
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
import { calculateDistance } from 'src/shared/utils/distance.util';
import { GetGeneralInformationEmployeeDto } from './dto/get_general_information-employee.dto';
import { EditGeneralInformationEmployeeDto } from './dto/edit_general_information-employee.dto';
import { GetPersonalInformationEmployeeDto } from './dto/get_personal_information.dto';
import { EditPersonalInformationEmployeeDto } from './dto/edit_personal_information-employee.dto';
import { PersonalInformation } from 'src/personal_information/entities/personal_information.entity';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class EmployeeService {
  private otps: Record<
    string,
    { otp: string; expiresAt: number; isUsed: boolean }
  > = {};
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(GeneralInformation)
    private generalInformationRepository: Repository<GeneralInformation>,
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
    @InjectRepository(PersonalInformation)
    private personalInformationRepository: Repository<PersonalInformation>,

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
      throw new NotFoundException('Employee not found for this company');
    }
    // Pastikan bahwa email tidak bisa diubah
    if (employee.email !== email) {
      throw new BadRequestException(
        'Account is already registered, please use another account',
      );
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

    employee.token_auth = token_auth;
    await this.employeeRepository.save(employee);

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
    const { id_employee, description, proof_of_attendance, department } =
      employeePermissionAttendanceDto;

    try {
      // Verifikasi token (memeriksa apakah token valid secara kriptografis)
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth); // Verifying JWT token
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Simpan permission attendance
      const permissionAttendance = new PermissionAttendance();
      permissionAttendance.description = description;
      permissionAttendance.department = department;
      permissionAttendance.proof_of_attendance = proof_of_attendance;
      permissionAttendance.employee = employee;
      permissionAttendance.status = 'Request';

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
      throw new InternalServerErrorException(
        'Error sent permission attendance',
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

      // Simpan OTP dan waktu kedaluwarsa dalam memori
      this.otps[email] = { otp, expiresAt, isUsed: false };

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
        subject: 'Kode OTP Reset Password | Jangan beri tahu siapa pun!',
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
          'Account is already registered, please use another account',
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
      // Verifikasi token (memeriksa apakah token valid secara kriptografis)
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth); // Verifying JWT token
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['company'], // Pastikan mengambil data company juga
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Ambil informasi perusahaan
      const company = employee.company;
      if (!company) {
        throw new NotFoundException('Company not found for this employee');
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
        throw new BadRequestException(
          `Clock-in location is outside the allowed radius (${company.set_radius} meters)`,
        );
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
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error clock in');
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
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth); // Verifying JWT token
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['company'],
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Ambil informasi perusahaan
      const company = employee.company;
      if (!company) {
        throw new NotFoundException('Company not found for this employee');
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
        throw new BadRequestException(
          `Clock-out location is outside the allowed radius (${company.set_radius} meters)`,
        );
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

      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully clock out',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error clock out');
    }
  }

  // Fungsi baru untuk create debt request
  async debtRequest(
    token_auth: string,
    debtRequestEmployeeDto: DebtRequestEmployeeDto,
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
      remaining_saldo_debt,
      department,
    } = debtRequestEmployeeDto;

    try {
      // Verifikasi token (memeriksa apakah token valid secara kriptografis)
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth); // Verifying JWT token
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Validasi apakah saldo mencukupi
      if (remaining_saldo_debt < nominal_request) {
        throw new BadRequestException('Insufficient remaining saldo kasbon');
      }

      // Validasi apakah saldo mencukupi
      if (grand_total_request > remaining_saldo_debt) {
        throw new BadRequestException(
          `Your balance is not enough. Available saldo: ${remaining_saldo_debt}`,
        );
      }

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
      debtRequest.department = department;
      debtRequest.status = 'Request'; // Set status "request,berhasil,ditolak"

      // Simpan DebtRequest ke dalam database tanpa menyimpan remaining_saldo_debt
      await this.debtRequestRepository.save(debtRequest);

      // Kembalikan respons sukses bersama dengan saldo yang tersisa
      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully created debt request',
      };
    } catch (error) {
      // Tangani error lainnya
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Tangani error internal
      throw new InternalServerErrorException('Error creating debt request');
    }
  }

  async getGeneralInformation(
    token_auth: string,
    getGeneralInformationEmployeeDto: GetGeneralInformationEmployeeDto,
  ): Promise<any> {
    const { id_employee } = getGeneralInformationEmployeeDto;

    try {
      // Verifikasi token (memeriksa apakah token valid secara kriptografis)
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth); // Verifikasi JWT token
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      // Verifikasi apakah token valid di database
      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['generalInformation'], // Pastikan relasi general information dimuat
      });

      // Jika employee tidak ditemukan, lemparkan NotFoundException
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Ambil informasi umum (general information) dari employee yang ditemukan
      const generalInfo = employee.generalInformation;

      // Kembalikan informasi umum dari employee
      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully get general information',
        general_information: {
          employee_name: employee.employee_name,
          place_of_birth: generalInfo.user_place_of_birth,
          date_of_birth: generalInfo.user_date_of_birth,
          religion: generalInfo.user_religion,
          user_gender: generalInfo.user_gender,
          phone: generalInfo.phone,
          user_addresses: generalInfo.user_addresses_idcard,
          address_domicile: generalInfo.user_address_domicile,
          last_education: generalInfo.last_education,
        },
      };
    } catch (error) {
      // Jika error yang dilemparkan adalah NotFoundException atau UnauthorizedException, lempar kembali
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Tangani error internal lainnya
      throw new InternalServerErrorException('Error get general information');
    }
  }

  async editGeneralInformation(
    token_auth: string,
    editGeneralInformationEmployeeDto: EditGeneralInformationEmployeeDto,
  ): Promise<any> {
    const {
      employee_name,
      place_of_birth,
      date_of_birth,
      religion,
      user_gender,
      phone,
      user_addresses,
      address_domicile,
      last_education,
    } = editGeneralInformationEmployeeDto;

    try {
      // Verifikasi token
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth);
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      // Verifikasi apakah token valid di database
      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee: validToken.id_employee },
        relations: ['generalInformation'], // Pastikan kita memuat relasi general information
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Perbarui employee_name di entitas Employee
      employee.employee_name = employee_name;

      // Perbarui informasi di GeneralInformation
      const generalInformation = employee.generalInformation;

      // Perbarui informasi
      generalInformation.user_religion = religion;
      generalInformation.user_place_of_birth = place_of_birth;
      generalInformation.user_date_of_birth = new Date(date_of_birth);
      generalInformation.user_gender = user_gender;
      generalInformation.phone = phone;
      generalInformation.user_addresses_idcard = user_addresses;
      generalInformation.user_address_domicile = address_domicile;
      generalInformation.last_education = last_education;

      // Simpan perubahan ke database
      await this.employeeRepository.save(employee); // Simpan employee_name
      await this.generalInformationRepository.save(generalInformation); // Simpan generalInformation

      // Kembalikan response sukses
      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully edited general information',
      };
    } catch (error) {
      // Tangani error khusus
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Tangani error internal
      throw new InternalServerErrorException(
        'Error editing general information',
      );
    }
  }

  async getPersonalInformation(
    token_auth: string,
    getPersonalInformationEmployeeDto: GetPersonalInformationEmployeeDto,
  ): Promise<any> {
    const { id_employee } = getPersonalInformationEmployeeDto;

    try {
      // Verifikasi token (memeriksa apakah token valid secara kriptografis)
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth); // Verifikasi JWT token
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      // Verifikasi apakah token valid di database
      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['personalInformation'],
      });

      // Jika employee tidak ditemukan, lemparkan NotFoundException
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Ambil informasi umum (general information) dari employee yang ditemukan
      const personalInfo = employee.personalInformation;

      // Kembalikan informasi umum dari employee
      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully get personal information',
        personal_information: {
          id_card: personalInfo.id_card,
          tax_identification_number: personalInfo.tax_identification_number,
          tax_type: personalInfo.tax_type,
          tax_deduction: personalInfo.tax_deduction,
          bank_name: personalInfo.bank_name,
          account_number: personalInfo.account_number,
          account_name: personalInfo.account_name,
          health_card: personalInfo.health_card,
          work_card: personalInfo.work_card,
        },
      };
    } catch (error) {
      // Jika error yang dilemparkan adalah NotFoundException atau UnauthorizedException, lempar kembali
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Tangani error internal lainnya
      throw new InternalServerErrorException('Error get general information');
    }
  }

  async editPersonalInformation(
    token_auth: string,
    editPersonalInformationEmployeeDto: EditPersonalInformationEmployeeDto,
  ): Promise<any> {
    const { id_employee, id_card, tax_identification_number } =
      editPersonalInformationEmployeeDto;

    try {
      // Verifikasi token
      let decodedToken;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decodedToken = this.jwtService.verify(token_auth); // Verifikasi token JWT
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Token verification failed');
        }
      }

      // Verifikasi apakah token valid di database
      const validToken = await this.employeeRepository.findOne({
        where: { token_auth },
      });

      if (!validToken) {
        throw new NotFoundException('Token not found');
      }

      // Cari employee berdasarkan id_employee
      const employee = await this.employeeRepository.findOne({
        where: { id_employee },
        relations: ['personalInformation'], // Memuat relasi personal information
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Perbarui informasi di PersonalInformation
      const personalInformation = employee.personalInformation;

      if (!personalInformation) {
        throw new NotFoundException('Personal information not found');
      }

      // Update data personalInformation
      personalInformation.id_card = id_card;
      personalInformation.tax_identification_number = tax_identification_number;

      // Simpan perubahan personalInformation
      await this.personalInformationRepository.save(personalInformation);

      // Kembalikan response sukses
      return {
        statusCode: 201,
        status: 'success',
        message: 'Successfully edit personal information',
      };
    } catch (error) {
      // Tangani error khusus
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Tangani error internal lainnya
      throw new InternalServerErrorException('Error edit personal information');
    }
  }
}
