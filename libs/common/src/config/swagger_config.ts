import metadata from '#api/metadata';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

export const generateSwaggerDoc = async (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Account Service')
    .setDescription('Account Service API')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local')
    .addServer('http://localhost:3013', 'Local (SAT Bare Metal)')
    .addBearerAuth({
      type: 'http',
      description: 'Enter JWT token',
    })
    .addCookieAuth('SESSION')
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);

  return SwaggerModule.createDocument(app, options, {
    extraModels: [],
  });
};

export const initSwagger = async (app: INestApplication, apiPath: string) => {
  const document = await generateSwaggerDoc(app);

  // write swagger.json to disk
  fs.writeFileSync(
    './docs/swagger.json',
    JSON.stringify(document, (_, v) => v, 2),
  );
  SwaggerModule.setup(apiPath, app, document);
};
