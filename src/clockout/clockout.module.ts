import { Module } from '@nestjs/common';
import { ClockoutService } from './clockout.service';
import { ClockoutController } from './clockout.controller';

@Module({
  controllers: [ClockoutController],
  providers: [ClockoutService],
})
export class ClockoutModule {}
