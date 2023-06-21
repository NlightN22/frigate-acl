import { Test, TestingModule } from '@nestjs/testing';
import { ApieventsController } from './apievents.controller';

describe('ApieventsController', () => {
  let controller: ApieventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApieventsController],
    }).compile();

    controller = module.get<ApieventsController>(ApieventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
