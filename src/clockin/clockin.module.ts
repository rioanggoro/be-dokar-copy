import { Module } from '@nestjs/common';
import { ClockinService } from './clockin.service';
import { ClockinController } from './clockin.controller';

@Module({
  controllers: [ClockinController],
  providers: [ClockinService],
})
export class ClockinModule {}
