export function JwtToken(authorizationHeader: string): string {
  const token = authorizationHeader.split('Bearer')[1];
  return token;
}
