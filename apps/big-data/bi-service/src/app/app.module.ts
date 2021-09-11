import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
// import UsersModule from './users';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
