import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyAttendanceService } from './monthly_attendance.service';

describe('MonthlyAttendanceService', () => {
  let service: MonthlyAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyAttendanceService],
    }).compile();

    service = module.get<MonthlyAttendanceService>(MonthlyAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
