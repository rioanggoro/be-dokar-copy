import { Test, TestingModule } from '@nestjs/testing';
import { PermissionAttendanceController } from './permission_attendance.controller';
import { PermissionAttendanceService } from './permission_attendance.service';

describe('PermissionAttendanceController', () => {
  let controller: PermissionAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionAttendanceController],
      providers: [PermissionAttendanceService],
    }).compile();

    controller = module.get<PermissionAttendanceController>(PermissionAttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
