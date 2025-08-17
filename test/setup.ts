import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';
import { CustomValidationPipe } from 'src/common/validation/custom-validation.pipe';
import { DatabaseService } from 'src/database/database.service';
import { CacheService } from 'src/core/cache/cache.service';
// import { ConfigService } from '@nestjs/config';

let app: INestApplication<App>;
let server: App;
// let configService: ConfigService;
let databaseService: DatabaseService;
let cacheService: CacheService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  // Copy what you have in main.ts to test the real app
  app.use(helmet());
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
    }),
  );

  await app.init();

  // Retrieving config service
  // configService = app.get(ConfigService);
  databaseService = app.get(DatabaseService);
  cacheService = app.get(CacheService);
  server = app.getHttpServer();
});

afterAll(async () => {
  await app.close();
});

// Reset database and cache
afterEach(async () => {
  await cacheService.reset();
  await databaseService.reset();
});

export { server };
