import { Test, TestingModule } from '@nestjs/testing';
import { PersonalInformationController } from './personal_information.controller';
import { PersonalInformationService } from './personal_information.service';

describe('PersonalInformationController', () => {
  let controller: PersonalInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalInformationController],
      providers: [PersonalInformationService],
    }).compile();

    controller = module.get<PersonalInformationController>(PersonalInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
