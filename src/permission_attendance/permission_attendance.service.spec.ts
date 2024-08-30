import { Test, TestingModule } from '@nestjs/testing';
import { PermissionAttendanceService } from './permission_attendance.service';

describe('PermissionAttendanceService', () => {
  let service: PermissionAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionAttendanceService],
    }).compile();

    service = module.get<PermissionAttendanceService>(PermissionAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
