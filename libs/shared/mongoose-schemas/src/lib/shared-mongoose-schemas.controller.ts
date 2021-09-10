import { Controller } from '@nestjs/common';
import { SharedMongooseSchemasService } from './shared-mongoose-schemas.service';

@Controller('shared-mongoose-schemas')
export class SharedMongooseSchemasController {
  constructor(
    private sharedMongooseSchemasService: SharedMongooseSchemasService
  ) {}
}
