import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UrlService } from '../../url.service';
import { UrlExistsPipe } from './url-exists.pipe';
import { Url } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('UrlExistsPipe', () => {
  let urlExistPipe: UrlExistsPipe;
  let urlService: DeepMocked<UrlService>;

  beforeEach(() => {
    urlService = createMock<UrlService>();
    urlExistPipe = new UrlExistsPipe(urlService);
  });
  it('should be defined', () => {
    expect(urlExistPipe).toBeDefined();
  });

  it('should return the object url if its found', async () => {
    const url: Url = {
      id: 123,
      description: 'Description goes here',
      redirect: 'https://example.com',
      title: 'Dummy',
      url: 'https://localhost',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    urlService.findOne.mockResolvedValue(url);

    const result = await urlExistPipe.transform(`random-uid`);
    expect(result).toEqual(url);
  });

  it('should throw not found exception if url is not found', () => {
    urlService.findOne.mockResolvedValue(null);

    const result = async () => await urlExistPipe.transform(`random-uid`);
    expect(result).rejects.toThrow(NotFoundException);
  });
});
