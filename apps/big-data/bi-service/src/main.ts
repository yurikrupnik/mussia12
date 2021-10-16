import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import fs from 'fs';
import yaml from 'yaml';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new ConsoleLogger('App'),
  });
  const globalPrefix = 'api';
  app.use(helmet());
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.contentSecurityPolicy());
  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle('General API')
    .setDescription('General use cloud run api')
    .setVersion('1.0')
    // .setBasePath('/')
    .addBearerAuth()
    .addBasicAuth()
    .addOAuth2()
    .addCookieAuth('optional-session-id')
    // .setBasePath('/api/users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document, {
    swaggerOptions: {},
  });
  // const yamlString: string = yaml.stringify(document, {});
  // fs.writeFileSync('./swaggers/bi-service.yaml', yamlString);

  // fs.writeFileSync('./swagger-spec.yaml', JSON.stringify(document));

  console.log('process.env.PORT,', process.env.PORT);
  console.log('process.env.port,', process.env.port);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
