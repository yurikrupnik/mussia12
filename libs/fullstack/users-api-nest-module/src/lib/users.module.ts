import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from '@mussia12/fullstack/health-api-nest-module';
import { User, UserSchema } from '@mussia12/shared/mongoose-schemas';
import { mongoConfig } from '@mussia12/shared/configs';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig().MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HealthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [User],
})
export class UsersModule {}
