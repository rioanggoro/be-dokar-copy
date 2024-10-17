import { Test, TestingModule } from '@nestjs/testing';
import { DailyAttendanceController } from './daily_attendance.controller';
import { DailyAttendanceService } from './daily_attendance.service';

describe('DailyAttendanceController', () => {
  let controller: DailyAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyAttendanceController],
      providers: [DailyAttendanceService],
    }).compile();

    controller = module.get<DailyAttendanceController>(DailyAttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
