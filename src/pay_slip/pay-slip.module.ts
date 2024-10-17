import { Module } from '@nestjs/common';
import { TotalMonthlyAttendanceService } from './pay-slip.service';
import { TotalMonthlyAttendanceController } from './pay-slip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaySlip } from './entities/pay-slip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaySlip])],
  controllers: [TotalMonthlyAttendanceController],
  providers: [TotalMonthlyAttendanceService],
})
export class PaySlipModule {}
