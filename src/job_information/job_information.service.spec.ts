import { Test, TestingModule } from '@nestjs/testing';
import { JobInformationService } from './job_information.service';

describe('JobInformationService', () => {
  let service: JobInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobInformationService],
    }).compile();

    service = module.get<JobInformationService>(JobInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
