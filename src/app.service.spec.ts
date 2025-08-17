import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { INestApplication } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';
import { createMock } from '@golevelup/ts-jest';
import { DatabaseService } from './database/database.service';
import { CacheService } from './core/cache/cache.service';

describe('AppService', () => {
  let appService: AppService;
  let app: INestApplication;
  // let cacheService: DeepMocked<CacheService>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: createMock<LoggerService>(), //Fake instance
        },
        {
          provide: DatabaseService,
          useValue: createMock<DatabaseService>(), //Fake instance
        },
        {
          provide: CacheService,
          useValue: createMock<CacheService>(), //Fake instance
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    appService = app.get<AppService>(AppService);
    // cacheService = app.get(CacheService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('root', () => {
    it('should return "Hello World"', async () => {
      // If function returns something from a service
      // cacheService.get.mockResolvedValue(`SAMPLE VAL`);
      // const res = await appService.getHello();
      // expect(res).toBe('SAMPLE VAL');

      expect(await appService.getHello()).toBe('Hello World');
    });
  });
});
