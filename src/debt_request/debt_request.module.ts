import { Module } from '@nestjs/common';
import { DebtRequestService } from './debt_request.service';
import { DebtRequestController } from './debt_request.controller';

@Module({
  controllers: [DebtRequestController],
  providers: [DebtRequestService],
})
export class DebtRequestModule {}
