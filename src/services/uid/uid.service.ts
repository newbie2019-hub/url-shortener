import { Injectable } from '@nestjs/common';
import { v4 as uuidv4, Version4Options } from 'uuid';

@Injectable()
export class UidService {
  generate(options?: Version4Options) {
    return uuidv4(options);
  }
}
