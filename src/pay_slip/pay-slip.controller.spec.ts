import { Test, TestingModule } from '@nestjs/testing';
import { TotalMonthlyAttendanceController } from './pay-slip.controller';
import { TotalMonthlyAttendanceService } from './pay-slip.service';

describe('TotalMonthlyAttendanceController', () => {
  let controller: TotalMonthlyAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotalMonthlyAttendanceController],
      providers: [TotalMonthlyAttendanceService],
    }).compile();

    controller = module.get<TotalMonthlyAttendanceController>(
      TotalMonthlyAttendanceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
