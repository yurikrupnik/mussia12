import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { LoggerModule } from 'nestjs-rollbar';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
