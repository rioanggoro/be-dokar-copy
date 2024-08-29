import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JobInformation } from 'src/job_information/entities/job_information.entity';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobInformation, Employee, Company]),
    JwtModule.register({
      secret: 'your_secret_key', // Ganti dengan kunci rahasia Anda
      signOptions: { expiresIn: '1h' }, // Waktu kedaluwarsa token
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
