import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EmployeeModule } from './employee/employee.module';
import { CompanyModule } from './company/company.module';
import { JobInformationModule } from 'src/job_information/job_information.module';

@Module({
  imports: [
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
        synchronize: false, // Set true in development to auto-sync schema
      }),
    }),
    EmployeeModule,
    CompanyModule,
    JobInformationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
