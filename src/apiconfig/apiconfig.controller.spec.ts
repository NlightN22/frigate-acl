import { Test, TestingModule } from "@nestjs/testing";
import { ApiconfigController } from "./apiconfig.controller";


describe('ApiconfigController', () => {
  let controller: ApiconfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiconfigController],
    }).compile();

    controller = module.get<ApiconfigController>(ApiconfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
