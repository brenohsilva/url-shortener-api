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

@Controller('shortened-urls')
export class ShortenedUrlsController {
  constructor(
    private readonly shortenedUrlsService: ShortenedUrlsService,
    private readonly createShortenedUrlUseCase: CreateShortenedUrlUseCase,
  ) {}

  @Post()
  create(@Body() data: string) {
    return this.createShortenedUrlUseCase.execute(data);
  }

  @Get()
  findAll() {
    return this.shortenedUrlsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shortenedUrlsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShortenedUrlDto: UpdateShortenedUrlDto,
  ) {
    return this.shortenedUrlsService.update(id, updateShortenedUrlDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.shortenedUrlsService.remove(id);
  // }
}
