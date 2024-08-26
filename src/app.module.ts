import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RegisterEmployeeModule } from './register-employee/register-employee.module';
import { EmployeeModule } from './employee/employee.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Konfigurasi environment variables
    JwtModule.register({
      secret: 'user321', // Gantilah dengan secret key yang lebih kuat
      signOptions: { expiresIn: '1h' }, // JWT akan kadaluarsa setelah 1 jam
    }),
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
    RegisterEmployeeModule,
    EmployeeModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
