import { NextResponse } from 'next/server';
import { PoolClient, Pool } from 'pg';
import pool from '@/lib/db';

const typedPool: Pool = pool as Pool;

export async function GET() {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();
        await client.query('BEGIN');

        const checkQuery = `SELECT * FROM "ItemMaster" WHERE isactive=true`;
        const data = await client.query(checkQuery);
        const result = data.rows;

        await client.query('COMMIT');

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during item fetching:", error);

        return NextResponse.json({
            message: "An unexpected error occurred during item fetching",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
