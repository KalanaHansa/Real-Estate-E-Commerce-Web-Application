import mysql from 'mysql2/promise';

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

if (!dbHost || !dbUser || !dbName) {
  console.warn(
    '[db.ts] WARNING: Database environment variables are not fully configured. ' +
    'Expected: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME. ' +
    'API routes that require the database will return errors until this is resolved.'
  );
}

// Detect if we're connecting to Azure MySQL (hostname contains .mysql.database.azure.com)
const isAzureMySQL = dbHost?.includes('.mysql.database.azure.com') ?? false;

const pool = mysql.createPool({
  host: dbHost || 'localhost',
  user: dbUser || 'root',
  password: dbPassword || '',
  database: dbName || 'real_estate_db',
  port: Number(process.env.DB_PORT) || 3306,
  // Enable SSL for Azure MySQL
  ...(isAzureMySQL && {
    ssl: {
      rejectUnauthorized: true,
    },
  }),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [results] = await pool.execute(sql, params);
  return results as T;
}