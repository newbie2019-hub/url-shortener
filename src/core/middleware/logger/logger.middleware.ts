import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { url, method } = req;
      const logData = { url, method };
      const logMsg = `${method} ${url}`;
      const { statusCode } = res;

      if (statusCode === 500) {
        this.logger.error(logMsg, undefined, 'HTTP', logData);
      } else if (statusCode >= 400) {
        this.logger.warn(logMsg, 'HTTP', logData);
      } else {
        this.logger.log(logMsg, 'HTTP', logData);
      }
    });

    next();
  }
}
