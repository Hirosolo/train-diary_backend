import { Pool, QueryResult } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Please set DATABASE_URL in your environment");
}

/**
 * Global pool to avoid creating multiple pools in dev hot reload.
 */
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const pool: Pool = global.__pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10
});

if (!global.__pgPool) global.__pgPool = pool;

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // optional debug:
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

export default {
  query
};