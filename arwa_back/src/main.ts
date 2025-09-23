import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLoggerConfig } from './3-Infrastructure/Logger/logger.config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { SeedDataService } from './4-Application/21-SeedingApp/seedData.Service';
import { SeedingService } from './4-Application/21-SeedingApp/seeding.Service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLoggerConfig,
  });

  await new SeedingService(app).SeedData();

  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:4200',
      'https://www.felsport.com',
      'https://admin.felsport.com',
      'https://felsport.com',
    ],
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Origin,Accept,Content-Type,Authorization,x-auth-token',
  };
  app.enableCors(corsOptions);

  await app.get<SeedDataService>(SeedDataService).SeedData();

  // app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());
  // Step 4: Add @Api() and @ApiOperation() decorators to your API endpoints
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
