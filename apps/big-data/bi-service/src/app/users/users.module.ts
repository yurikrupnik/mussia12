import {
  MiddlewareConsumer,
  Module,
  NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '@mussia12/shared/mongoose-schemas';
import { HealthModule } from '../health/health.module';

import { AuthMiddleware } from '../common/auth/auth.middleware';
import config from '../common/config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot(config().MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HealthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware);
    // .exclude('')
    // .forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
