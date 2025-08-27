import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UidModule } from 'src/services/uid/uid.module';
import { PaginateModule } from 'src/services/paginate/paginate.module';

@Module({
  imports: [UidModule, PaginateModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
