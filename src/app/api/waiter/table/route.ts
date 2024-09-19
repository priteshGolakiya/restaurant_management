import { NextResponse } from "next/server"
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";

const typedPool: Pool = pool as Pool;

export async function GET() {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();
        await client.query('BEGIN');

        const checkQuery = `SELECT * FROM "TableMaster"`;
        const data = await client.query(checkQuery);
        const result = data.rows

        await client.query('COMMIT');

        return NextResponse.json(
            { result, success: true, }, { status: 200 }
        );

    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during fetching Table Data:", error);

        return NextResponse.json({
            message: "An unexpected error occurred during Table data fetching",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
