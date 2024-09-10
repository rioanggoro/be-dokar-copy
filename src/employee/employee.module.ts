import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from 'src/employee/employee.controller';
import { PermissionAttendance } from 'src/permission_attendance/entities/permission_attendance.entity';
import { Employee } from './entities/employee.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Company } from 'src/company/entities/company.entity';
import { GeneralInforamtion } from 'src/general_inforamtion/entities/general_inforamtion.entity';
import { JobInformation } from 'src/job_information/entities/job_information.entity';
import { ClockIn } from 'src/clockin/entities/clockin.entity';
import { ClockOut } from 'src/clockout/entities/clockout.entity';
import { DebtRequest } from 'src/debt_request/entities/debt_request.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      JobInformation,
      Employee,
      Company,
      GeneralInforamtion,
      PermissionAttendance,
      ClockIn,
      ClockOut,
      DebtRequest,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 0, // Waktu dalam detik untuk mempertahankan hit
      limit: 0, // Jumlah maksimal permintaan yang diizinkan dalam ttl
    }),
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class EmployeeModule {}
