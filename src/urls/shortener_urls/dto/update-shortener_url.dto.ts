import { PartialType } from '@nestjs/swagger';

import { CreateShortenerUrlDto } from './create-shortener_url.dto';

export class UpdateShortenerUrlDto extends PartialType(CreateShortenerUrlDto) {}
