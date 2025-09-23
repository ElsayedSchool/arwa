import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private logger: Logger = new Logger('ErrorFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      this.logger.error(exception.getResponse());
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`Status: ${status}, Message: ${message}`);

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
