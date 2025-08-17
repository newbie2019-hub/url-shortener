import { Injectable } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';
import { CacheService } from './core/cache/cache.service';

@Injectable()
export class AppService {
  private context = `AppService`;
  constructor(
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
  ) {}

  async getHello() {
    this.logger.log(`calling from inside of app service`, this.context, {
      id: 1,
    });

    await this.cacheService.set('key', 'SAMPLE VAL', 3000);
    // const res = await this.cacheService.get('key');
    return 'Hello World';
  }
}
