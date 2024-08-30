import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('permission-attendance')
  async createPermissionAttendance(
    @Request() req, // Menangkap request untuk mendapatkan data token yang sudah diverifikasi
    @Body('description') description: string,
    @Body('proof_of_attendance') proof_of_attendance: string,
  ) {
    const id_employee = req.user; // Ambil id_employee dari payload token yang sudah diverifikasi
    return this.employeeService.createPermissionAttendance(
      id_employee,
      description,
      proof_of_attendance,
    );
  }
}
