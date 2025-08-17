import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './services/sentry';
import helmet from 'helmet';

import { CustomValidationPipe } from './common/validation/custom-validation.pipe';
import { LoggerService } from './core/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // will wait for everything to be setup for the custom logger to work
  });
  // Using custom logger
  app.useLogger(app.get(LoggerService));
  app.use(helmet());
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
