import { Test } from '@nestjs/testing';
import { SharedMongooseSchemasController } from './shared-mongoose-schemas.controller';
import { SharedMongooseSchemasService } from './shared-mongoose-schemas.service';

describe('SharedMongooseSchemasController', () => {
  let controller: SharedMongooseSchemasController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SharedMongooseSchemasService],
      controllers: [SharedMongooseSchemasController],
    }).compile();

    controller = module.get(SharedMongooseSchemasController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
