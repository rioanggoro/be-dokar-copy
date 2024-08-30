import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(50, 300)
  @Post('permission-attendance')
  async createPermissionAttendance(
    @Headers('Authorization') authHeader: string,
    @Body('id_employee') id_employee: number,
    @Body('description') description: string,
    @Body('proof_of_attendance') proof_of_attendance: string,
  ) {
    // Tambahkan pengecekan untuk memastikan authHeader tidak undefined
    if (!authHeader) {
      throw new NotFoundException('Token not found');
    }

    const token_auth = authHeader.split(' ')[1]; // Ekstrak token dari header Authorization

    // Lanjutkan dengan logika lainnya
    return this.employeeService.createPermissionAttendance(
      id_employee,
      token_auth,
      description,
      proof_of_attendance,
    );
  }
}
