import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from 'src/services/uid/uid.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { GetUrlsDto } from './dto/get-urls.dto';
import { PaginateService } from 'src/services/paginate/paginate.service';

@Injectable()
export class UrlService {
  private host: string;

  constructor(
    private readonly uuidService: UidService,
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly paginationService: PaginateService,
  ) {}

  onModuleInit() {
    this.host = this.configService.getOrThrow<string>('app_url');
  }

  async create(createUrlDto: CreateUrlDto) {
    const uuidv4 = this.uuidService.generate();
    const url = await this.dbService.url.create({
      data: {
        ...createUrlDto,
        url: `${this.host}/${uuidv4}`,
      },
    });

    return url;
  }

  async findAll({ filter, page = 1, limit = 10 }: GetUrlsDto) {
    // Filter
    const whereFilter = filter
      ? {
          OR: [
            {
              title: { contains: filter },
            },
            {
              description: { contains: filter },
            },
            {
              redirect: { contains: filter },
            },
          ],
        }
      : {};

    const urls = await this.dbService.url.findMany({
      where: whereFilter,
      take: limit,
      skip: limit * (page - 1),
    });

    const totalCount = await this.dbService.url.count();

    const meta = this.paginationService.paginate({
      totalCount,
      page,
      limit,
      filter,
    });

    return {
      data: urls,
      meta,
    };
  }

  async findOne(uid: string) {
    return await this.dbService.url.findUnique({
      where: {
        url: `${this.host}/${uid}`,
      },
    });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return await this.dbService.url.update({
      where: { id: id },
      data: updateUrlDto,
    });
  }

  async remove(id: number) {
    return await this.dbService.url.delete({
      where: { id },
    });
  }
}
