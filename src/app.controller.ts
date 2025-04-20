import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiRedirectShortenedUrl } from './urls/shortener_urls/shortener-urls-swagger.decorator';
import { RedirectShortenedUrlUseCase } from './urls/shortener_urls/usecases/redirect-shortener-url.usecase';


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
