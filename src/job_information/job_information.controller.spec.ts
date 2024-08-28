import { Test, TestingModule } from '@nestjs/testing';
import { JobInformationController } from './job_information.controller';
import { JobInformationService } from './job_information.service';

describe('JobInformationController', () => {
  let controller: JobInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobInformationController],
      providers: [JobInformationService],
    }).compile();

    controller = module.get<JobInformationController>(JobInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
