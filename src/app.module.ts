import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AuthModule } from './identity/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './identity/users/users.module';
import { ShortenedUrlsModule } from './shortener_urls/shortener-urls.module';
import { ShortenerUrlsService } from './shortener_urls/shortener-urls.service';
import { RedirectShortenedUrlUseCase } from './shortener_urls/usecases/redirect-shortener-url.usecase';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspacesModule } from './identity/workspaces/workspaces.module';

@Module({
  imports: [PrismaModule, UsersModule, ShortenedUrlsModule, AuthModule, WorkspacesModule],
  controllers: [AppController],
  providers: [PrismaService, ShortenerUrlsService, RedirectShortenedUrlUseCase],
})
export class AppModule {}
