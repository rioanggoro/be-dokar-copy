import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';

@Injectable()
export class RegisterEmployeeService {
  constructor(private readonly jwtService: JwtService) {}

  private readonly employees = []; // Simulasi database

  async register(
    createRegisterEmployeeDto: CreateRegisterEmployeeDto,
  ): Promise<any> {
    const { email, id_employee } = createRegisterEmployeeDto;

    // Cek apakah email sudah terdaftar
    const existingEmployee = this.employees.find((emp) => emp.email === email);
    if (existingEmployee) {
      throw new ConflictException(
        'Account is already registered, please use another account',
      );
    }

    // Simpan data karyawan ke database (saat ini hanya push ke array untuk simulasi)
    this.employees.push(createRegisterEmployeeDto);

    // Generate JWT token
    const payload = { email, sub: id_employee }; // `sub` biasanya digunakan untuk menyimpan ID unik (misalnya ID karyawan)
    const token = this.jwtService.sign(payload);

    // Kembalikan response sukses beserta token
    return {
      statusCode: 200,
      status: 'success',
      message: 'Register successful',
      token_auth: token,
    };
  }
}
