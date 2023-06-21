import { Test, TestingModule } from '@nestjs/testing';
import { ApieventsService } from './apievents.service';

describe('ApieventsService', () => {
  let service: ApieventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApieventsService],
    }).compile();

    service = module.get<ApieventsService>(ApieventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
