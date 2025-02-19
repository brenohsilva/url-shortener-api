import { PartialType } from '@nestjs/mapped-types';
import { CreateShortenedUrlDto } from './create-shortened_url.dto';

export class UpdateShortenedUrlDto extends PartialType(CreateShortenedUrlDto) {
  clicks?: number;
}
