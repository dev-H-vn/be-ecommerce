import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('API')
    .addBearerAuth({
      type: 'http',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token to access these api endpoints',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addGlobalParameters({ name: 'CLIENT-ID', in: 'header' });

  if (process.env.API_VERSION) {
    documentBuilder.setVersion('1.1.0');
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
