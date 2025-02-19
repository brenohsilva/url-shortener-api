import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ShortenedUrlsModule } from './shortened_urls/shortened_urls.module';

@Module({
  imports: [UsersModule, ShortenedUrlsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
