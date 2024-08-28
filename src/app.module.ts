import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EmployeeModule } from './employee/employee.module';
import { CompanyModule } from './company/company.module';
import { GeneralInforamtionModule } from './general_inforamtion/general_inforamtion.module';

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
        synchronize: false,
      }),
    }),
    EmployeeModule,
    CompanyModule,
    GeneralInforamtionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
