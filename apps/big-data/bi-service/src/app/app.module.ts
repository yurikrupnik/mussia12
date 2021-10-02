import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { LoggerModule } from 'nestjs-rollbar';
import { UsersModule } from '@mussia12/fullstack/api-modules';
import { Event1Module } from './event1/event1.module';
import { Event2Module } from './event2/event2.module';
import { BiModule } from './bi/bi.module';
import { mongoConfig } from '@mussia12/shared/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig],
    }),
    // LoggerModule.forRoot({
    //   // accessToken: configService.get('ROLLBAR_TOKEN'),
    //   // environment: configService.get('ENVIROMENT'),
    // }),
    UsersModule,
    Event1Module,
    Event2Module,
    BiModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
