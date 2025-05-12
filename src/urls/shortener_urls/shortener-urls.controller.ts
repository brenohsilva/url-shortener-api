import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShortenerUrlsService } from './shortener-urls.service';
import { AuthGuard } from 'src/identity/auth/auth.guard';
import {
  ApiCreateShortenedUrl,
  ApiDeleteShortenedUrl,
  ApiFindAllShortenedUrls,
  ApiFindOneShortenedUrl,
  ApiUpdateShortenedUrl,
} from './shortener-urls-swagger.decorator';
import { UpdateShortenerUrlDto } from './dto/update-shortener_url.dto';
import { ShortenerUrlBodyDto } from './dto/create-shortener_url-body.dto';
import { CreateShortenerUrlUseCase } from './usecases/create-shortener-url.usecase';
import { IQuery } from 'src/interfaces/query-interface';

@Controller('api/urls')
export class ShortenedUrlsController {
  constructor(
    private readonly shortenerUrlsService: ShortenerUrlsService,
    private readonly createShortenerUrlUseCase: CreateShortenerUrlUseCase,
  ) {}

  @Post()
  @ApiCreateShortenedUrl()
  create(@Body() data: ShortenerUrlBodyDto, @Req() request: Request) {
    return this.createShortenerUrlUseCase.execute(data, request);
  }

  @Get()
  @ApiFindAllShortenedUrls()
  @UseGuards(AuthGuard)
  findAll(@Req() request: Request, @Query() queries: IQuery) {
    return this.shortenerUrlsService.findAll(request, queries);
  }

  @Get('clicks')
  @UseGuards(AuthGuard)
  findUrlClicks(@Req() request: Request, @Query() queries: IQuery) {
    return this.shortenerUrlsService.findUrlsClicks(request, queries);
  }

  @Get('tags')
  @UseGuards(AuthGuard)
  findTags(@Req() request: Request) {
    return this.shortenerUrlsService.findTags(request);
  }

  @Get(':id')
  @ApiFindOneShortenedUrl()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.shortenerUrlsService.findOne(+id, request);
  }

  @Patch(':id')
  @ApiUpdateShortenedUrl()
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateShortenerUrlDto: UpdateShortenerUrlDto,
    @Req() request: Request,
  ) {
    return this.shortenerUrlsService.update(
      +id,
      updateShortenerUrlDto,
      request,
    );
  }

  @Delete(':id')
  @ApiDeleteShortenedUrl()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.shortenerUrlsService.remove(+id);
  }
}
