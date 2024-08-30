import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Post('permission-attendance')
  async createPermissionAttendance(
    @Body('id_employee') id_employee: number,
    @Body('description') description: string,
    @Body('proof_of_attendance') proof_of_attendance: string, // Pastikan nama kunci ini benar
  ) {
    return this.employeeService.createPermissionAttendance(
      id_employee,
      description,
      proof_of_attendance,
    );
  }
}
