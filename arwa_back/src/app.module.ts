import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configSchema } from "./1-Core/Configurations/config.Schema";
import { HttpLoggerMiddleware } from "./1-Core/Middlewares/logging.middleware";
import { AuthenticationModule } from "./4-Application/0-AuthenticationApp/authentication.module";
import { UserProfileModule } from "./4-Application/2-UserProfileApp/user-profile.module";
import { BcryptService } from "./3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { databaseConfig } from "./1-Core/Configurations/database.config";
import { SeedingModule } from "./4-Application/21-SeedingApp/Seeding.Module";
import { CustomerModule } from "./4-Application/4-CustomerApp/customer.module";
import { SupplierModule } from "./4-Application/9-SupplierApp/supplier.module";
import { UserManagerModule } from "./4-Application/1-UserManagerApp/userManager.module";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { existsSync } from "fs";

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/static",
      serveStaticOptions: {
        cacheControl: true,
        maxAge: 5500,
        setHeaders(res, path, stat) {
          res.setHeader("Cache-Control", "public, max-age=3600");
        },
      },
      // The prefix for your static file routes (e.g., /static/file.txt)
    }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        // prefer compiled path (dist) but fall back to source path for dev
        path: existsSync(join(__dirname, "i18n"))
          ? join(__dirname, "i18n")
          : join(process.cwd(), "src", "i18n"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configSchema,
    }),
    ServeStaticModule.forRoot({
      serveRoot: "/photos", // Specify the route for serving images
      rootPath: join(__dirname, "..", "uploads"), // Path to your static files
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthenticationModule,
    UserProfileModule,
    UserManagerModule,
    SeedingModule,
    CustomerModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
//npx typeorm migration:create ./src/migrations/data
