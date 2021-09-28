import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '@mussia12/shared/mongoose-schemas';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    // todo make env var
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost/mussia12'
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HealthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
