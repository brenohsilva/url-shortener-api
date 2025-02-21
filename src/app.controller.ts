import { Controller, Get, Param, Res } from '@nestjs/common';
import { RedirectShortenedUrlUseCase } from './shortened_urls/usecases/redirect-shortened-url.usecase';
import { Response } from 'express';
import { ApiRedirectShortenedUrl } from './shortened_urls/shortened_urls.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly redirectShortenedUrlUseCase: RedirectShortenedUrlUseCase,
  ) {}

  @Get(':shortCode')
  @ApiRedirectShortenedUrl()
  redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    return this.redirectShortenedUrlUseCase.execute(shortCode, res);
  }
}
