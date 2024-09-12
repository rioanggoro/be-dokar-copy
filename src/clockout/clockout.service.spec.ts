import { Test, TestingModule } from '@nestjs/testing';
import { ClockoutService } from './clockout.service';

describe('ClockoutService', () => {
  let service: ClockoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClockoutService],
    }).compile();

    service = module.get<ClockoutService>(ClockoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
