import { Pool } from 'pg';
import Redis from 'ioredis';

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  REDIS_HOST,
} = process.env;

export const db = new Pool({
  host: POSTGRES_HOST,
  port: 5432,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
});

export const cache = new Redis({
  host: REDIS_HOST,
  port: 6379,
});
