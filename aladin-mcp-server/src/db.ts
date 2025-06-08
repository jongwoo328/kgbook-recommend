import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
  max: 20,
  min: 5,
  idleTimeoutMillis: 150000,
  connectionTimeoutMillis: 2000,
});

export const db = pool;
