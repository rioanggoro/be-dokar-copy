import { Module } from '@nestjs/common';
import { RegisterEmployeeService } from './register-employee.service';
import { RegisterEmployeeController } from './register-employee.controller';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'user321', // Gantilah dengan secret key yang lebih kuat
      signOptions: { expiresIn: '1h' }, // JWT akan kadaluarsa setelah 1 jam
    }),
    ThrottlerModule.forRoot({
      ttl: 10, // Time to live in seconds
      limit: 1, // Maximum number of requests within the TTL
    }),
  ],
  controllers: [RegisterEmployeeController],
  providers: [
    RegisterEmployeeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RegisterEmployeeModule {}
