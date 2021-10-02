import { Test, TestingModule } from '@nestjs/testing';
import { Event2Service } from './event2.service';

describe('Event2Service', () => {
  let service: Event2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Event2Service],
    }).compile();

    service = module.get<Event2Service>(Event2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
