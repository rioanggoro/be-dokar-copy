import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
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
    proof_of_attendance: string,
  ): Promise<any> {
    try {
      // Validasi input
      if (!id_employee) {
        throw new BadRequestException('Employee ID is required');
      }
      if (!description) {
        throw new BadRequestException('Description is required');
      }
      if (!proof_of_attendance) {
        throw new BadRequestException('Proof of attendance is required');
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
        error instanceof NotFoundException
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
}
