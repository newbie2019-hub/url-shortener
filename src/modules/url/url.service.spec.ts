import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UidService } from 'src/services/uid/uid.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { PaginateService } from 'src/services/paginate/paginate.service';
import { DeepMockProxy } from 'jest-mock-extended';
import { createMockUrl } from 'test/factories/url.factory';

describe('UrlService', () => {
  let urlService: UrlService;
  let uidService: DeepMocked<UidService>;
  // DeepMocked doesnt work for extended service like DatabaseService
  let databaseService: DeepMockProxy<DatabaseService>;
  let configService: DeepMocked<ConfigService>;
  let paginationService: DeepMocked<PaginateService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: UidService,
          useValue: createMock<UidService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: DatabaseService,
          useValue: createMock<DatabaseService>(),
        },
        {
          provide: PaginateService,
          useValue: createMock<PaginateService>(),
        },
      ],
    }).compile();

    // Needed for onModuleInit() on Url Service
    const app = module.createNestApplication();

    urlService = module.get<UrlService>(UrlService);
    uidService = module.get(UidService);
    databaseService = module.get(DatabaseService);
    configService = module.get(ConfigService);
    paginationService = module.get(PaginateService);

    configService.getOrThrow.mockReturnValueOnce('localhost:3000');

    await app.init();
  });

  describe(`create`, () => {
    it(`should create a new url`, async () => {
      const payload = {
        redirect: 'https://example.com',
        title: 'Test',
        description: 'Description goes here',
      };

      const randUid = 'XXX-XXX';
      const mockedUrl = {
        id: 1,
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'localhost:3000',
      };

      uidService.generate.mockReturnValueOnce(randUid);
      databaseService.url.create.mockResolvedValueOnce(mockedUrl);
      const result = await urlService.create(payload);

      expect(result).toEqual(mockedUrl);
    });
  });

  describe(`findOne`, () => {
    it(`should return the url object based on url`, async () => {
      const uid = `XXX-XXX`;

      const mockedUrl = {
        id: 1,
        redirect: 'https://example.com',
        title: 'Test',
        description: 'Description goes here',
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `localhost:3000/${uid}`,
      };

      databaseService.url.findUnique.mockResolvedValueOnce(mockedUrl);
      const result = await urlService.findOne(uid);
      expect(result).toEqual(mockedUrl);
    });
  });

  describe(`findAll`, () => {
    it(`should return a list of paginated urls without query params`, () => {
      const urls = Array.from({ length: 5 }, () => createMockUrl());
      const pagination = { page: 1, limit: 10 };
      const meta = {
        totalCount: urls.length,
        currentPage: pagination.page,
        perPage: pagination.limit,
        totalPages: Math.ceil(urls.length / pagination.limit),
        nextPage: null,
        prevPage: null,
      };
      databaseService.url.findMany.mockResolvedValueOnce(urls);
      databaseService.url.count.mockResolvedValueOnce(urls.length);
      paginationService.paginate.mockReturnValueOnce({
        totalCount: urls.length,
        currentPage: pagination.page,
        perPage: pagination.limit,
        totalPages: Math.ceil(urls.length / pagination.limit),
        nextPage: null,
        prevPage: null,
      });

      expect({ data: urls, meta }).toEqual({ data: urls, meta });
    });
  });

  describe(`update`, () => {
    it(`should return the updated url object`, async () => {
      const mockedUrl = createMockUrl();
      const updatedDescription = 'Updated description';

      databaseService.url.update.mockResolvedValueOnce({
        ...mockedUrl,
        description: updatedDescription,
      });
      const result = await urlService.update(mockedUrl.id, {
        description: updatedDescription,
      });

      expect(result).toEqual({
        ...mockedUrl,
        description: updatedDescription,
      });
    });
  });

  describe(`remove`, () => {
    it(`should return the url object after deletion`, async () => {
      const id = 1;

      const mockedUrl = {
        id,
        redirect: 'https://example.com',
        title: 'Test',
        description: 'Description goes here',
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'localhost:3000',
      };

      databaseService.url.delete.mockResolvedValueOnce(mockedUrl);
      const result = await urlService.remove(id);
      expect(result).toEqual(mockedUrl);
    });
  });
});
