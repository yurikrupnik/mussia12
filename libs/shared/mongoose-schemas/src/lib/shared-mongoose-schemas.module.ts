import { Module, Global } from '@nestjs/common';
import { SharedMongooseSchemasController } from './shared-mongoose-schemas.controller';
import { SharedMongooseSchemasService } from './shared-mongoose-schemas.service';

@Global()
@Module({
  controllers: [SharedMongooseSchemasController],
  providers: [SharedMongooseSchemasService],
  exports: [SharedMongooseSchemasService],
})
export class SharedMongooseSchemasModule {}
