import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ShortenedUrlsModule } from './shortened_urls/shortened_urls.module';
import { AuthModule } from './auth/auth.module';
import { RedirectShortenedUrlUseCase } from './shortened_urls/usecases/redirect-shortened-url.usecase';
import { ShortenedUrlsService } from './shortened_urls/shortened_urls.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UsersModule, ShortenedUrlsModule, AuthModule],
  controllers: [AppController],
  providers: [PrismaService, ShortenedUrlsService, RedirectShortenedUrlUseCase],
})
export class AppModule {}
