import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost/mussia12'
    ),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
