import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { CompanyModule } from 'src/company/company.module';
import { JwtModule } from '@nestjs/jwt';

import { APP_GUARD } from '@nestjs/core';
import { GeneralInforamtion } from 'src/general_inforamtion/entities/general_inforamtion.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneralInforamtion, Employee, Company]),
    CompanyModule,
    JwtModule.register({
      secret: 'user321',
      signOptions: { expiresIn: '1h' },
      
    }),
    ThrottlerModule.forRoot({
      ttl: 60, // Waktu dalam detik untuk mempertahankan hit
      limit: 10, // Jumlah maksimal permintaan yang diizinkan dalam ttl
    })
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class EmployeeModule {}
