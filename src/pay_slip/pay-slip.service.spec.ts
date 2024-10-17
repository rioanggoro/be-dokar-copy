import { Test, TestingModule } from '@nestjs/testing';
import { TotalMonthlyAttendanceService } from './pay-slip.service';

describe('TotalMonthlyAttendanceService', () => {
  let service: TotalMonthlyAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TotalMonthlyAttendanceService],
    }).compile();

    service = module.get<TotalMonthlyAttendanceService>(
      TotalMonthlyAttendanceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
