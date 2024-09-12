import { Test, TestingModule } from '@nestjs/testing';
import { DebtRequestService } from './debt_request.service';

describe('DebtRequestService', () => {
  let service: DebtRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebtRequestService],
    }).compile();

    service = module.get<DebtRequestService>(DebtRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
