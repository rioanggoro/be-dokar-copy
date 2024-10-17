import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesettingsService } from './attendancesettings.service';

describe('AttendancesettingsService', () => {
  let service: AttendancesettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendancesettingsService],
    }).compile();

    service = module.get<AttendancesettingsService>(AttendancesettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
