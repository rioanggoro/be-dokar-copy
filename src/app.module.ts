import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EmployeeModule } from './employee/employee.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CompanyModule } from './company/company.module';
import { EmployeeJobinformationCompanyModule } from './employee-jobinformation-company/employee-jobinformation-company.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10, // Time to live in seconds
      limit: 1, // Maximum number of requests within the TTL
    } as any),
    ConfigModule.forRoot(),
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
        synchronize: false,
      }),
    }),
    EmployeeModule,
    CompanyModule,
    EmployeeJobinformationCompanyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
