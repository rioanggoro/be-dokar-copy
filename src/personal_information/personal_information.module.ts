import { Module } from '@nestjs/common';
import { PersonalInformationService } from './personal_information.service';
import { PersonalInformationController } from './personal_information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalInformation } from './entities/personal_information.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInformation, Employee])],
  controllers: [PersonalInformationController],
  providers: [PersonalInformationService],
})
export class PersonalInformationModule {}
