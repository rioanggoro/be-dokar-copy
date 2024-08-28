import { Test, TestingModule } from '@nestjs/testing';
import { GeneralInforamtionService } from './general_inforamtion.service';

describe('GeneralInforamtionService', () => {
  let service: GeneralInforamtionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralInforamtionService],
    }).compile();

    service = module.get<GeneralInforamtionService>(GeneralInforamtionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
