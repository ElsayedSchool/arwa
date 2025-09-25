import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm"; // Import the ConfigService (adjust the path as needed).

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const isProduction = configService.get("STAGE") === "prod";

    return {
      ssl: isProduction,
      extra: { ssl: isProduction ? { rejectUnauthorized: false } : null },
      type: "postgres",
      host: configService.get("DB_HOST"),
      port: configService.get("DB_PORT"),
      username: configService.get("DB_USERNAME"),
      password: configService.get("DB_PASSWORD"),
      database: configService.get("DB_NAME"),
      // support both compiled and ts-node dev layouts
      entities: ((): string[] => {
        const compiled = "dist/src/2-Domain/index.js";
        const compiledAlt = "dist/2-Domain/index.js";
        const dev = "src/2-Domain/index.ts";
        if (require("fs").existsSync(compiled)) return [compiled];
        if (require("fs").existsSync(compiledAlt)) return [compiledAlt];
        return [dev];
      })(),
      migrations: ((): string[] => {
        const compiledM = "dist/migrations/*.js";
        if (require("fs").existsSync("dist/migrations")) return [compiledM];
        // don't point to .ts migrations at runtime (avoids trying to require ts files)
        return [];
      })(),
      cli: {
        migrationsDir: "src/migration",
      },
      logging: false,
      synchronize: !isProduction,
    };
  },
};
