import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const winstonLoggerConfig = WinstonModule.createLogger({
  transports: [
    // file on daily rotation (error only)
    new DailyRotateFile({
      // %DATE will be replaced by the current date
      filename: `logs/%DATE%-error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // don't want to zip our logs
      maxFiles: '30d', // will keep log until they are older than 30 days
    }),
    // same for all levels
    new DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    }),
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
    }),
  ],
});
