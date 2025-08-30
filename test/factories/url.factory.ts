import { faker } from '@faker-js/faker';
import { Url } from '@prisma/client';

export function createMockUrl(overrides: Partial<Url> = {}): Url {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    redirect: faker.internet.url(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    createdAt: new Date(),
    updatedAt: new Date(),
    url: `localhost:3000/${faker.string.uuid()}`,
    ...overrides,
  };
}

export function createMockPayload(
  overrides: Partial<Url> = {},
): Pick<Url, 'redirect' | 'title' | 'description' | 'url'> {
  return {
    redirect: faker.internet.url(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    url: `localhost:3000/${faker.string.uuid()}`,
    ...overrides,
  };
}
