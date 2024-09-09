import { Test, TestingModule } from '@nestjs/testing';
import { ClockinController } from './clockin.controller';
import { ClockinService } from './clockin.service';

describe('ClockinController', () => {
  let controller: ClockinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockinController],
      providers: [ClockinService],
    }).compile();

    controller = module.get<ClockinController>(ClockinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
