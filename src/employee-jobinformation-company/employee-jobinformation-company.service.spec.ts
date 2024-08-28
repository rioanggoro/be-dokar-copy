import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeJobinformationCompanyService } from './employee-jobinformation-company.service';

describe('EmployeeJobinformationCompanyService', () => {
  let service: EmployeeJobinformationCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeJobinformationCompanyService],
    }).compile();

    service = module.get<EmployeeJobinformationCompanyService>(EmployeeJobinformationCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
