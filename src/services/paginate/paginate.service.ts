import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pagination, PaginationMeta } from 'src/common/types/pagination.types';

@Injectable()
export class PaginateService {
  constructor(private readonly configService: ConfigService) {}

  paginate({ totalCount, page, limit, filter }: Pagination): PaginationMeta {
    let baseUrl = `${this.configService.getOrThrow<string>('app_url')}/url?limit=${limit}`;
    const totalPages = Math.ceil(totalCount / limit);

    if (filter) {
      baseUrl += `&filter=${encodeURIComponent(filter)}`;
    }

    const nextPage = page < totalPages ? `${baseUrl}&page=${page + 1}` : null;
    const prevPage = page > 1 ? `${baseUrl}&page=${page - 1}` : null;

    return {
      totalCount: totalCount,
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      nextPage,
      prevPage,
    };
  }
}
