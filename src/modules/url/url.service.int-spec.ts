import { DatabaseService } from 'src/database/database.service';
import { app } from '../../../test/setup';
import { UrlService } from './url.service';
import { createMockPayload } from 'test/factories/url.factory';

describe(`UrlService Integration Tests`, () => {
  let urlService: UrlService;
  let dbService: DatabaseService;

  beforeEach(() => {
    urlService = app.get(UrlService);
    dbService = app.get(DatabaseService);
  });

  describe(`create`, () => {
    it(`should create a new url`, async () => {
      const payload = {
        redirect: 'https://example.com',
        title: 'Test',
        description: 'Description goes here',
      };

      const url = await urlService.create(payload);
      const persistedUrl = await dbService.url.findUnique({
        where: {
          url: url.url,
        },
      });

      expect(url).toEqual(persistedUrl);
    });
  });

  describe(`findAll`, () => {
    it(`should return empty array when no urls exist in the database`, async () => {
      const urls = await urlService.findAll({});
      expect(urls.data).toEqual([]);
    });

    it(`should return array of persisted urls`, async () => {
      const mockedUrls = Array.from({ length: 10 }, () => createMockPayload());

      await dbService.url.createMany({ data: mockedUrls });

      const urls = await urlService.findAll({});
      expect(urls.data).toMatchObject(mockedUrls);
    });

    it(`should return first page of persisted urls`, async () => {
      const mockedUrls = Array.from({ length: 10 }, () => createMockPayload());

      await dbService.url.createMany({ data: mockedUrls });

      const urls = await urlService.findAll({ page: 1, limit: 5 });
      expect(urls.data).toMatchObject(mockedUrls.slice(0, 5));
      expect(urls.meta.currentPage).toEqual(1);
      expect(urls.data.length).toEqual(5);
    });

    it(`should return last page of persisted urls`, async () => {
      const LIMIT = 5;
      const mockedUrls = Array.from({ length: 20 }, () => createMockPayload());

      await dbService.url.createMany({ data: mockedUrls });

      const urls = await urlService.findAll({
        page: mockedUrls.length / LIMIT,
        limit: LIMIT,
      });
      expect(urls.data).toMatchObject(mockedUrls.slice(15));
      expect(urls.meta.currentPage).toEqual(mockedUrls.length / LIMIT);
      expect(urls.data.length).toEqual(LIMIT);
    });
  });

  describe(`findOne`, () => {
    it(`should return null when url does not exist`, async () => {
      const url = await urlService.findOne('non-existent-uuid');
      expect(url).toBeNull();
    });

    it(`should return url when found`, async () => {
      const uid = `123456`;
      const mockedUrl = createMockPayload({ url: `localhost:3000/${uid}` });
      await dbService.url.create({ data: mockedUrl });

      const url = await urlService.findOne(uid);
      expect(url).toMatchObject(mockedUrl);
    });
  });

  describe(`update`, () => {
    it(`should update and return the respective url`, async () => {
      const mockedPayload = createMockPayload();
      await dbService.url.create({ data: mockedPayload });

      // Update title
      const title = 'Updated Title';

      const updatedUrl = await urlService.update(1, { title });
      const updatedPersistedUrl = await dbService.url.findUnique({
        where: {
          id: 1,
        },
      });

      expect(updatedUrl).toEqual(updatedPersistedUrl);
    });
  });

  describe(`remove`, () => {
    it(`should remove and return the respective url`, async () => {
      const mockedPayload = createMockPayload();
      const createdUrl = await dbService.url.create({ data: mockedPayload });

      const removedUrl = await urlService.remove(1);
      const nonExistingUrl = await dbService.url.findUnique({
        where: {
          id: 1,
        },
      });

      expect(removedUrl).toEqual(createdUrl);
      expect(nonExistingUrl).toBeNull();
    });
  });
});
