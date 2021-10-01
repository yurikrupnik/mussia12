import { Module } from '@nestjs/common';
import { Event1Service } from './event1.service';
import { Event1Controller } from './event1.controller';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../common/config/configuration';
import { Event1, Event1Schema } from '@mussia12/shared/mongoose-schemas';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().MONGO_URI),
    MongooseModule.forFeature([{ name: Event1.name, schema: Event1Schema }]),
    HealthModule,
  ],
  controllers: [Event1Controller],
  providers: [Event1Service],
})
export class Event1Module {}
