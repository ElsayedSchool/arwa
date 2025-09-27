import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { winstonLoggerConfig } from "./3-Infrastructure/Logger/logger.config";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { SeedDataService } from "./4-Application/21-SeedingApp/seedData.Service";
import { SeedingService } from "./4-Application/21-SeedingApp/seeding.Service";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLoggerConfig,
  });

  await new SeedingService(app).SeedData();

  const allowedOrigins = [
    "http://localhost:4200",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "https://www.felsport.com",
    "https://admin.felsport.com",
    "https://felsport.com",
  ];

  const corsOptions: CorsOptions = {
    // In dev, allow any origin to simplify local testing; otherwise, restrict to list
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser or same-origin
      if (process.env.STAGE === "dev" || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "Accept",
      "Content-Type",
      "Authorization",
      "x-auth-token",
      "X-Skip-Auth-Redirect",
      "x-skip-auth-redirect",
    ],
  };
  app.enableCors(corsOptions);

  await app.get<SeedDataService>(SeedDataService).SeedData();

  // app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());
  // Step 4: Add @Api() and @ApiOperation() decorators to your API endpoints
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
