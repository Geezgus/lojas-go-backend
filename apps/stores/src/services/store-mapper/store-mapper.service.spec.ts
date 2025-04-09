import { Test, TestingModule } from '@nestjs/testing';
import { StoreMapperService } from './store-mapper.service';

describe('StoreMapperService', () => {
  let service: StoreMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreMapperService],
    }).compile();

    service = module.get<StoreMapperService>(StoreMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
