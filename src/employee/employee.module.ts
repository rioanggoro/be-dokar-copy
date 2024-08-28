import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JobInformation } from 'src/job_information/entities/job_information.entity';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobInformation, Employee, Company]),
    JwtModule.register({
      secret: 'your_secret_key', // Ganti dengan kunci rahasia Anda
      signOptions: { expiresIn: '1h' }, // Waktu kedaluwarsa token
    }),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
