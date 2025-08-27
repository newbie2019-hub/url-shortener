import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UrlModule } from './modules/url/url.module';
import { UidService } from './services/uid/uid.service';
import { UidModule } from './services/uid/uid.module';
import { PaginateModule } from './services/paginate/paginate.module';

@Module({
  imports: [CoreModule, UrlModule, UidModule, PaginateModule],
  controllers: [],
  providers: [UidService],
})
export class AppModule {}
