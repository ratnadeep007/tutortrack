import { Redis } from 'ioredis';

if (!process.env.REDIS_HOST) {
  throw new Error('REDIS_HOST is not defined');
}

if (!process.env.REDIS_PASSWORD) {
  throw new Error('REDIS_PASSWORD is not defined');
}

export const redis = new Redis(
  `rediss://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);
