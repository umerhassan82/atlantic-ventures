import { Pool } from 'pg';
import { config } from './env';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
});

export async function testConnection() {
  try {
    const result = await pool.query('SELECT count(device_id) as total from devices');
    console.log(result.rows[0]?.total)
    console.log('Database connected');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
