import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EmployeeModule } from './employee/employee.module';
import { CompanyModule } from './company/company.module';
import { JobInformationModule } from 'src/job_information/job_information.module';
import { GeneralInforamtionModule } from './general_inforamtion/general_inforamtion.module';
import { PermissionAttendanceModule } from './permission_attendance/permission_attendance.module';
import { ClockinModule } from './clockin/clockin.module';
import { ClockoutModule } from './clockout/clockout.module';
import { DebtRequestModule } from './debt_request/debt_request.module';
import { PersonalInformationModule } from './personal_information/personal_information.module';
import { NotificationModule } from './notification/notification.module';
import { DailyAttendanceModule } from './daily_attendance/daily_attendance.module';
import { MonthlyAttendanceModule } from './monthly_attendance/monthly_attendance.module';
import { AttendancesettingsModule } from './attendancesettings/attendancesettings.module';
import { PaySlip } from './pay_slip/entities/pay-slip.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Konfigurasi environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: false, // Set true in development to auto-sync schema
        ssl: false,
      }),
    }),
    EmployeeModule,
    PermissionAttendanceModule,
    CompanyModule,
    GeneralInforamtionModule,
    JobInformationModule,
    ClockinModule,
    ClockoutModule,
    DebtRequestModule,
    PersonalInformationModule,
    NotificationModule,
    DailyAttendanceModule,
    MonthlyAttendanceModule,
    AttendancesettingsModule,
    PaySlip,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
