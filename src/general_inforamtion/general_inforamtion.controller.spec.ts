import { Test, TestingModule } from '@nestjs/testing';
import { GeneralInforamtionController } from './general_inforamtion.controller';
import { GeneralInforamtionService } from './general_inforamtion.service';

describe('GeneralInforamtionController', () => {
  let controller: GeneralInforamtionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralInforamtionController],
      providers: [GeneralInforamtionService],
    }).compile();

    controller = module.get<GeneralInforamtionController>(GeneralInforamtionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
