import { Module } from '@nestjs/common';
import { NotificationService } from './notification.Service';
import { ConfigModule } from '@nestjs/config';
import { winstonLoggerConfig } from '../Logger/logger.config';
@Module({
  imports: [ConfigModule],
  providers: [
    NotificationService,
    {
      provide: 'Logger', // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
  ],
  exports: [NotificationService],
})
export class AppNotificationModule {}
