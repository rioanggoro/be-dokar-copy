import { Test, TestingModule } from '@nestjs/testing';
import { DailyAttendanceService } from './daily_attendance.service';

describe('DailyAttendanceService', () => {
  let service: DailyAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyAttendanceService],
    }).compile();

    service = module.get<DailyAttendanceService>(DailyAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
