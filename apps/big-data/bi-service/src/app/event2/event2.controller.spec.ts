import { Test, TestingModule } from '@nestjs/testing';
import { Event2Controller } from './event2.controller';
import { Event2Service } from './event2.service';

describe('Event2Controller', () => {
  let controller: Event2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Event2Controller],
      providers: [Event2Service],
    }).compile();

    controller = module.get<Event2Controller>(Event2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
