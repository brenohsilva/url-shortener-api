import * as crypto from 'crypto';

export function generateUniqueCode(): string {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  const base62 = Buffer.from(uuid, 'hex')
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '');
  return base62.substring(0, 6);
}
