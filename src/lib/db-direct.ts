import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    // 使用 PGDATABASE_URL 环境变量
    const connectionString = process.env.PGDATABASE_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Database connection string not found');
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function getPasswordFromDb(): Promise<string> {
  try {
    const result = await getPool().query(
      "SELECT value FROM settings WHERE key = 'admin_password'"
    );
    return result.rows[0]?.value || 'admin123';
  } catch (error) {
    console.error('Error fetching password from database:', error);
    return 'admin123';
  }
}

export async function setPasswordInDb(newPassword: string): Promise<boolean> {
  try {
    await getPool().query(
      `INSERT INTO settings (key, value, updated_at) 
       VALUES ('admin_password', $1, NOW()) 
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [newPassword]
    );
    return true;
  } catch (error) {
    console.error('Error setting password in database:', error);
    return false;
  }
}
