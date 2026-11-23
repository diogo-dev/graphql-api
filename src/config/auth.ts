import 'dotenv/config';
import type { SignOptions } from 'jsonwebtoken';

const secret = process.env.JWT_ACCESS_SECRET;
if (!secret) {
  throw new Error('JWT_ACCESS_SECRET is not set');
}

export const authConfig = {
  accessTokenSecret: secret,
  accessTokenExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'],
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS) || 7,
};
