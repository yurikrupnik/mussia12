import { NestFactory } from '@nestjs/core';
import { AppModule  } from './app/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';

export const createNestServer = async expressApp => {
  expressApp.disable('x-powered-by');
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.enableCors();
  return app.init();
};
