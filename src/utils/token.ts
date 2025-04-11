/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus } from '@nestjs/common';

export function JwtToken(request: Request): string {
  const authorizationHeader = request.headers['authorization'];
  if (!authorizationHeader) {
    throw new HttpException(
      'Erro ao gerar a url. Tente novamente mais tarde.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  const token: string = authorizationHeader.split('Bearer')[1];
  return token;
}
