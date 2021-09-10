import { Test } from '@nestjs/testing';
import { SharedMongooseSchemasService } from './shared-mongoose-schemas.service';

describe('SharedMongooseSchemasService', () => {
  let service: SharedMongooseSchemasService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SharedMongooseSchemasService],
    }).compile();

    service = module.get(SharedMongooseSchemasService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
