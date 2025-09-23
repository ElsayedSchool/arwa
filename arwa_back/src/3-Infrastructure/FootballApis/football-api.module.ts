import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FootballApiService } from './football-api.service';
import { winstonLoggerConfig } from '../Logger/logger.config';
import { ConfigModule } from '@nestjs/config';
import { TimeService } from '../timeService/time.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    FootballApiService,
    {
      provide: 'Logger', // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
    TimeService,
  ],
  exports: [FootballApiService],
})
export class FootballApiModule {}
