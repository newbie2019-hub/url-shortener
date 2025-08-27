import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Response } from 'express';
import { UrlExistsPipe } from './pipes/url-exists/url-exists.pipe';
import { Url } from '@prisma/client';
import { GetUrlsDto } from './dto/get-urls.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post(`url`)
  @UseGuards(AuthGuard)
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get(`url`)
  @UseGuards(AuthGuard)
  findAll(@Query() queryParams: GetUrlsDto) {
    return this.urlService.findAll(queryParams);
  }

  @Get(':uid')
  // Pipe will be used before proceeding to the respective
  // urlService layer.
  findOne(@Param('uid', UrlExistsPipe) uid: Url, @Res() res: Response) {
    return res.redirect(uid.redirect);
  }

  @Patch('url/:uid')
  @UseGuards(AuthGuard)
  update(
    @Param('uid', UrlExistsPipe) url: Url,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    return this.urlService.update(url.id, updateUrlDto);
  }

  @Delete('url/:uid')
  @UseGuards(AuthGuard)
  remove(@Param('uid', UrlExistsPipe) url: Url) {
    return this.urlService.remove(url.id);
  }
}
