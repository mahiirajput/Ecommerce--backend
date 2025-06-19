import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { add } from 'winston';  
import {WinstonModule} from 'nest-winston';
import { getWinstonConfig } from './config/logger.config';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  logger:WinstonModule.createLogger(getWinstonConfig('Main'));

  const config = new DocumentBuilder()
    .setTitle('Admin Authentication API')
    .setDescription('API for Admin Authentication and Authorization')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Swagger documentation is running at http://localhost:${port}/api-docs`);
  
  // await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
