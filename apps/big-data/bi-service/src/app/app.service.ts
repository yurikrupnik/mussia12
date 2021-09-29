import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getData(): { message: string } {
    const dbUser = this.configService.get<string>('MONGO_URI');
    return { message: dbUser };
  }
}
