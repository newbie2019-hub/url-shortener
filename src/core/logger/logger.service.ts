import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLogger {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const environment = this.configService.getOrThrow<string>('environment');
    const isDevelopment = environment === `development`;
    const isTesting = environment === `testing`;

    if (isTesting) return;

    const { timestamp, json, combine, colorize, printf } = winston.format;

    const logFormat = isDevelopment
      ? combine(
          colorize(),
          timestamp(),
          printf(({ timestamp, message, context, level, meta }) => {
            return `${timestamp as string} ${level} [${context as string}] ${message as string} ${meta ? `\n[META]: ${JSON.stringify(meta, null, 2)}` : ''}`;
          }),
        )
      : combine(timestamp(), json());

    this.logger = winston.createLogger({
      format: logFormat,
      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.info(message, { context, meta });
  }

  // message, trace, context
  error(
    message: string,
    trace?: string,
    context?: string,
    meta?: Record<string, any>,
  ) {
    this.logger.info(message, { trace, context, meta });
  }

  warn(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.info(message, { context, meta });
  }
}
