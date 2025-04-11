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
import { ShortenerUrlBodyDto } from './dto/shortener-url-body.dto';
import { CreateShortenerUrlUseCase } from './usecases/create-shortener-url.usecase';

@Controller('shortened-urls')
export class ShortenedUrlsController {
  constructor(private readonly shortenerUrlsService: ShortenerUrlsService,
    private readonly createShortenerUrlUseCase: CreateShortenerUrlUseCase
  ) {}

  @Post()
  @ApiCreateShortenedUrl()
  create(@Body() data: ShortenerUrlBodyDto, @Req() request: Request) {
    return this.createShortenerUrlUseCase.execute(data, request);
  }

  @Get('all')
  @ApiFindAllShortenedUrls()
  @UseGuards(AuthGuard)
  findAll(@Req() request: Request) {
    return this.shortenerUrlsService.findAll(request);
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
  ) {
    return this.shortenerUrlsService.update(+id, updateShortenerUrlDto);
  }

  @Delete(':id')
  @ApiDeleteShortenedUrl()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.shortenerUrlsService.remove(+id);
  }
}
