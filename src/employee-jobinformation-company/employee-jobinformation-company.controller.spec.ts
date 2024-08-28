import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeJobinformationCompanyController } from './employee-jobinformation-company.controller';
import { EmployeeJobinformationCompanyService } from './employee-jobinformation-company.service';

describe('EmployeeJobinformationCompanyController', () => {
  let controller: EmployeeJobinformationCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeJobinformationCompanyController],
      providers: [EmployeeJobinformationCompanyService],
    }).compile();

    controller = module.get<EmployeeJobinformationCompanyController>(EmployeeJobinformationCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
