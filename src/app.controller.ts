import { Controller, Get, Param, Res } from '@nestjs/common';
import { RedirectShortenedUrlUseCase } from './shortened_urls/usecases/redirect-shortened-url.usecase';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly redirectShortenedUrlUseCase: RedirectShortenedUrlUseCase,
  ) {}

  @Get(':shortCode')
  redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    return this.redirectShortenedUrlUseCase.execute(shortCode, res);
  }
}
