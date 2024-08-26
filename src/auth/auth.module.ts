import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: '12345', // Gantilah dengan secret key yang lebih kuat
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  exports: [JwtModule], // Ekspor JwtModule agar bisa digunakan di modul lain
})
export class AuthModule {}
