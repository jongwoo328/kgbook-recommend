import { Client, Pool } from 'pg';
import pgvector from 'pgvector/pg';

console.debug('Connecting to PostgreSQL database...');

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

console.debug('Connected to PostgreSQL !!');

pool.on('connect', async (client) => {
  console.debug('Connected to PostgreSQL !!');
  await pgvector.registerTypes(client);
});

pool.on('release', (err, client) => {
  if (err) {
    console.error('Error releasing PostgreSQL client:', err);
  } else {
    console.debug('pool connection released');
  }
});

pool.on('acquire', (client) => {
  console.debug('pool connection acquired');
});

pool.on('remove', (client) => {
  console.debug('pool connection removed');
});

export const db = pool;
