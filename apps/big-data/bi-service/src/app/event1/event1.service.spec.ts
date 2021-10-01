import { Test, TestingModule } from '@nestjs/testing';
import { Event1Service } from './event1.service';

describe('Event1Service', () => {
  let service: Event1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Event1Service],
    }).compile();

    service = module.get<Event1Service>(Event1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
