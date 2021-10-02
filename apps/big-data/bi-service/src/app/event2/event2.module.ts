import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Event2Service } from './event2.service';
import { Event2Controller } from './event2.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event2, Event2Schema } from '@mussia12/shared/mongoose-schemas';
import { HealthModule } from '../health/health.module';
import { AuthMiddleware } from '../common/auth/auth.middleware';
import { mongoConfig } from '@mussia12/shared/configs';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig().MONGO_URI),
    MongooseModule.forFeature([{ name: Event2.name, schema: Event2Schema }]),
    HealthModule,
  ],
  controllers: [Event2Controller],
  providers: [Event2Service],
})
export class Event2Module implements NestModule {
  public configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware);
    // .exclude('')
    // .forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
