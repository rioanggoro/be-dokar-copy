import { Module } from '@nestjs/common';
import { GeneralInforamtionService } from './general_inforamtion.service';
import { GeneralInforamtionController } from './general_inforamtion.controller';

@Module({
  controllers: [GeneralInforamtionController],
  providers: [GeneralInforamtionService],
})
export class GeneralInforamtionModule {}
