import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'; // Import the ConfigService (adjust the path as needed).

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const isProduction = configService.get('STAGE') === 'prod';

    return {
      ssl: isProduction,
      extra: { ssl: isProduction ? { rejectUnauthorized: false } : null },
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: ['dist/2-Domain/index.js'],
      migrations: ['dist/migrations/*.js'],
      cli: {
        migrationsDir: 'src/migration',
      },
      logging: false,
      synchronize: !isProduction,
    };
  },
};
