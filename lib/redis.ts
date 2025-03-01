import { Redis } from 'ioredis';

if (!process.env.REDIS_HOST) {
  throw new Error('REDIS_HOST is not defined');
}

if (!process.env.REDIS_PASSWORD) {
  throw new Error('REDIS_PASSWORD is not defined');
}

console.log('process.env.REDIS_HOST', process.env.REDIS_HOST);
console.log('process.env.REDIS_PASSWORD', process.env.REDIS_PASSWORD);
console.log('process.env.REDIS_PORT', process.env.REDIS_PORT);
console.log('process.env.REDIS_USER', process.env.REDIS_USER);

export const redis = new Redis(
  `rediss://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);
