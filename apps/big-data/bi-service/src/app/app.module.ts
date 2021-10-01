import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { LoggerModule } from 'nestjs-rollbar';
import { UsersModule } from './users/users.module';
import { Event1Module } from './event1/event1.module';
import { Event2Module } from './event2/event2.module';
import { BiModule } from './bi/bi.module';
import configuration from './common/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
