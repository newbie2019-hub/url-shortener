import * as request from 'supertest';
import { server } from './setup';

describe('UrlController E2E Tests', () => {
  describe(`POST /url`, () => {
    // invalid API key
    it(`should return 401 if no API key is provided`, async () => {
      await request(server).post('/url').expect(401);
    });

    it(`should return 401 if invalid api-key is provided`, async () => {
      await request(server)
        .post(`/url`)
        .set(`x-api-key`, `INVALID`)
        .expect(401);
    });

    it(`should return 422 if payload is invalid`, async () => {
      await request(server)
        .post(`/url`)
        .send({
          redirect: 'test',
          title: 'Test',
          description: 'test',
        })
        .set(`x-api-key`, `SECRET`)
        .expect(422);
    });

    it(`should return 201 if payload is valid and JSON body is valid`, async () => {
      await request(server)
        .post(`/url`)
        .send({
          redirect: 'https://youtube.com',
          title: 'Test',
          description: 'test',
        })
        .set(`x-api-key`, `SECRET`)
        .expect(201)
        .expect(({ body }: { body: { data: Record<string, any> } }) => {
          const { data } = body;
          expect(data.redirect).toEqual('https://youtube.com');
          expect(data.title).toEqual(`Test`);
          expect(data.description).toEqual(`test`);
          expect(data).toHaveProperty(`id`);
          expect(data).toHaveProperty(`createdAt`);
          expect(data).toHaveProperty(`updatedAt`);
        });
    });
  });
});
