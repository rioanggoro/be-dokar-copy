import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyAttendanceController } from './monthly_attendance.controller';
import { MonthlyAttendanceService } from './monthly_attendance.service';

describe('MonthlyAttendanceController', () => {
  let controller: MonthlyAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyAttendanceController],
      providers: [MonthlyAttendanceService],
    }).compile();

    controller = module.get<MonthlyAttendanceController>(MonthlyAttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
