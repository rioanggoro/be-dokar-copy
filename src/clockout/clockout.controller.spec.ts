import { Test, TestingModule } from '@nestjs/testing';
import { ClockoutController } from './clockout.controller';
import { ClockoutService } from './clockout.service';

describe('ClockoutController', () => {
  let controller: ClockoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockoutController],
      providers: [ClockoutService],
    }).compile();

    controller = module.get<ClockoutController>(ClockoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
