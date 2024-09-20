import { Test, TestingModule } from '@nestjs/testing';
import { PersonalInformationService } from './personal_information.service';

describe('PersonalInformationService', () => {
  let service: PersonalInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalInformationService],
    }).compile();

    service = module.get<PersonalInformationService>(PersonalInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
