import { Module } from '@nestjs/common';
import { UidService } from './uid.service';

@Module({
  providers: [UidService],
  // If you want to use the UidService outside of this module
  exports: [UidService],
})
export class UidModule {}
