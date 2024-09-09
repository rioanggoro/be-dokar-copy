import { Test, TestingModule } from '@nestjs/testing';
import { ClockinService } from './clockin.service';

describe('ClockinService', () => {
  let service: ClockinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClockinService],
    }).compile();

    service = module.get<ClockinService>(ClockinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
