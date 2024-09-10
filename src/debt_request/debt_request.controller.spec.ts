import { Test, TestingModule } from '@nestjs/testing';
import { DebtRequestController } from './debt_request.controller';
import { DebtRequestService } from './debt_request.service';

describe('DebtRequestController', () => {
  let controller: DebtRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtRequestController],
      providers: [DebtRequestService],
    }).compile();

    controller = module.get<DebtRequestController>(DebtRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
