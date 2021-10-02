import { Module } from '@nestjs/common';

import { UsersModule } from '@mussia12/fullstack/api-modules';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
