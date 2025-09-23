import { Module } from "@nestjs/common";
import { RepositoryModule } from "./Repositories/repository.module";
import { AuthModule } from "./Authentication/Auth.Module";
import { PhotosService } from "./PhotosApi/photos.service";
import { winstonLoggerConfig } from "./Logger/logger.config";
import { FootballApiModule } from "./FootballApis/football-api.module";
import { AppTimeModule } from "./timeService/time.Module";
import { AppNotificationModule } from "./Notification/notification.module";
import { MailModule } from "./MailApi/mail.module";
import { CachingModule } from "./caching/caching.module";
import { TranslateModule } from "./Translation/tanslation.module";

@Module({
  imports: [
    RepositoryModule,
    AuthModule,
    FootballApiModule,
    AppTimeModule,
    AppNotificationModule,
    MailModule,
    CachingModule,
    TranslateModule,
  ],
  providers: [
    {
      provide: "Logger", // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
    PhotosService,
  ],
  exports: [
    RepositoryModule,
    AuthModule,
    PhotosService,
    FootballApiModule,
    AppTimeModule,
    AppNotificationModule,
    MailModule,
    CachingModule,
    TranslateModule,
  ],
})
export class InfrastructureModule {}
