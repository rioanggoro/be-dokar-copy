import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesettingsController } from './attendancesettings.controller';
import { AttendancesettingsService } from './attendancesettings.service';

describe('AttendancesettingsController', () => {
  let controller: AttendancesettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendancesettingsController],
      providers: [AttendancesettingsService],
    }).compile();

    controller = module.get<AttendancesettingsController>(AttendancesettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
