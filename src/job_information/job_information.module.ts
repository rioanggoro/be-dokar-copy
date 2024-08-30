import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobInformation } from 'src/job_information/entities/job_information.entity'; // Sesuaikan path sesuai struktur file Anda
import { Employee } from 'src/employee/entities/employee.entity';
import { Company } from 'src/company/entities/company.entity';
import { JobInformationService } from './job_information.service';
import { JobInformationController } from './job_information.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobInformation, Employee, Company])],
  providers: [JobInformationService],
  controllers: [JobInformationController],
})
export class JobInformationModule {}
