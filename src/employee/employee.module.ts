import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { CompanyModule } from 'src/company/company.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GeneralInforamtion } from 'src/general_inforamtion/entities/general_inforamtion.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([GeneralInforamtion, Employee, Company]),
    CompanyModule,
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
