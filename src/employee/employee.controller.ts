import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  @Post('permission-attendance')
  async createPermissionAttendance(
    @Body('token_auth') token_auth: string,
    @Body('id_employee') id_employee: number,
    @Body('description') description: string,
    @Body('proof_of_attendance') proof_of_attendance: string,
  ) {
    return this.employeeService.createPermissionAttendance(
      token_auth,
      id_employee,
      description,
      proof_of_attendance,
    );
  }
}
