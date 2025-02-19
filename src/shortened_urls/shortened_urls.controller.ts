import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShortenedUrlsService } from './shortened_urls.service';
import { UpdateShortenedUrlDto } from './dto/update-shortened_url.dto';
import { CreateShortenedUrlUseCase } from './usecases/create-shortened-url.usecase';
import { DeleteShortenedUrlUseCase } from './usecases/delete-shortened-url.usecase';
import { ShortenedUrlBodyDto } from './dto/create-shortened_url.dto';
import { FindAllShortenedUrlsUseCase } from './usecases/find-all-shortened-urls.usecase';
import { FindOneShortenedUrlsUseCase } from './usecases/find-one-shortened-url-usecase';

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
  create(@Body() data: ShortenedUrlBodyDto) {
    return this.createShortenedUrlUseCase.execute(data);
  }

  @Get()
  findAll() {
    return this.findShortenedUrlUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneShortenedUrlUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShortenedUrlDto: UpdateShortenedUrlDto,
  ) {
    return this.shortenedUrlsService.update(id, updateShortenedUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteShortenedUrlUseCase.execute(id);
  }
}
