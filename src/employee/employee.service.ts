import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionAttendance } from 'src/permission_attendance/entities/permission_attendance.entity';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  login(createEmployeeDto: CreateEmployeeDto) {
    throw new Error('Method not implemented.');
  }
  jwtService: any;
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(PermissionAttendance)
    private permissionAttendanceRepository: Repository<PermissionAttendance>,
  ) {}

  async createPermissionAttendance(
    token_auth: string,
    id_employee: number,
    description: string,
    proof_of_attendance: string,
  ): Promise<any> {
    // Verifikasi token JWT
    try {
      const decoded = this.jwtService.verify(token_auth);
      if (decoded.id !== id_employee) {
        throw new InternalServerErrorException('Invalid token');
      }
    } catch (error) {
      throw new InternalServerErrorException('Invalid token');
    }

    // Cari employee berdasarkan id
    const employee = await this.employeeRepository.findOne({
      where: { id_employee },
    });

    if (!employee) {
      throw new InternalServerErrorException('Employee not found');
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
      message: 'successfully sent permission attendance',
    };
  }
}
