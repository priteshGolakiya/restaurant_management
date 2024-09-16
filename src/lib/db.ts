import { Pool } from 'pg';

let pool: Pool | null = null;


if (!pool) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL!,
        ssl: {
            rejectUnauthorized: false
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
    });
}

export default pool;