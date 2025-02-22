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
import { ShortenedUrlsService } from './shortened_urls.service';
import { UpdateShortenedUrlDto } from './dto/update-shortened_url.dto';
import { CreateShortenedUrlUseCase } from './usecases/create-shortened-url.usecase';
import { DeleteShortenedUrlUseCase } from './usecases/delete-shortened-url.usecase';
import { ShortenedUrlBodyDto } from './dto/create-shortened_url.dto';
import { FindAllShortenedUrlsUseCase } from './usecases/find-all-shortened-urls.usecase';
import { FindOneShortenedUrlsUseCase } from './usecases/find-one-shortened-url-usecase';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiCreateShortenedUrl,
  ApiDeleteShortenedUrl,
  ApiFindAllShortenedUrls,
  ApiFindOneShortenedUrl,
  ApiUpdateShortenedUrl,
} from './shortened_urls.decorator';

@Controller('shortened-urls')
export class ShortenedUrlsController {
  constructor(
    private readonly shortenedUrlsService: ShortenedUrlsService,
    private readonly createShortenedUrlUseCase: CreateShortenedUrlUseCase,
    private readonly deleteShortenedUrlUseCase: DeleteShortenedUrlUseCase,
    private readonly findShortenedUrlUseCase: FindAllShortenedUrlsUseCase,
    private readonly findOneShortenedUrlUseCase: FindOneShortenedUrlsUseCase,
  ) {}

  @Post()
  @ApiCreateShortenedUrl()
  create(@Body() data: ShortenedUrlBodyDto, @Req() request: Request) {
    return this.createShortenedUrlUseCase.execute(data, request);
  }

  @Get('all')
  @ApiFindAllShortenedUrls()
  @UseGuards(AuthGuard)
  findAll(@Req() request: Request) {
    return this.findShortenedUrlUseCase.execute(request);
  }

  @Get(':id')
  @ApiFindOneShortenedUrl()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.findOneShortenedUrlUseCase.execute(id, request);
  }

  @Patch(':id')
  @ApiUpdateShortenedUrl()
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateShortenedUrlDto: UpdateShortenedUrlDto,
  ) {
    return this.shortenedUrlsService.update(id, updateShortenedUrlDto);
  }

  @Delete(':id')
  @ApiDeleteShortenedUrl()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.deleteShortenedUrlUseCase.execute(id, request);
  }
}
