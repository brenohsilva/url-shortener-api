export class CreateShortenedUrlDto {
  users_id?: string;
  short_code: string;
  original_url: string;
}

export class ShortenedUrlBodyDto {
  url: string
}