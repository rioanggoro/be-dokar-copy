import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { PermissionAttendance } from 'src/permission_attendance/entities/permission_attendance.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(PermissionAttendance)
    private permissionAttendanceRepository: Repository<PermissionAttendance>,
  ) {}

  async createPermissionAttendance(
    id_employee: number,
    description: string,
    proof_of_attendance: string, // Pastikan nama kunci ini benar
  ): Promise<any> {
    try {
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
    } catch (error) {
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
}
