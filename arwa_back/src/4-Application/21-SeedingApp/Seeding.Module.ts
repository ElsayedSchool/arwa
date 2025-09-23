import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/3-Infrastructure/Repositories/repository.module';
import { SeedDataService } from './seedData.Service';
import { winstonLoggerConfig } from 'src/3-Infrastructure/Logger/logger.config';
import { BcryptService } from 'src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RepositoryModule, ConfigModule],
  providers: [
    SeedDataService,
    BcryptService,
    {
      provide: 'Logger', // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
  ],
  exports: [SeedDataService],
})
export class SeedingModule {}
