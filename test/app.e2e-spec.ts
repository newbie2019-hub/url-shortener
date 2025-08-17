import * as request from 'supertest';
import { server } from './setup';

describe('AppController (e2e)', () => {
  it('/ (GET)', async () => {
    return request(server)
      .get('/')
      .expect(200)
      .expect(({ body }: { body: { data: any } }) => {
        expect(body.data).toBe('Hello World');
      });
  });
});
