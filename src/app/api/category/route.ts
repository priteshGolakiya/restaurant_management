import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";

const typedPool: Pool = pool as Pool;

export async function POST(request: Request) {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();
        await client.query('BEGIN');

        const { categoryName } = await request.json();
        const checkQuery = `SELECT * FROM "CategoryMaster" WHERE "categoryname" = $1`;
        const result = await client.query(checkQuery, [categoryName]);

        if (result.rows.length > 0) {
            await client.query('ROLLBACK');
            return new NextResponse('Category already exists', {
                status: 400,
            });
        }

        const insertQuery = `INSERT INTO "CategoryMaster" ("categoryname","isactive") VALUES ($1, $2) RETURNING *`;
        const insertResult = await client.query(insertQuery, [categoryName, true]);
        console.log('insertResult::: ', insertResult);
        const categoryId = insertResult.rows[0];

        if (!categoryId || !categoryId.categoryid) {
            await client.query('ROLLBACK');
            return new NextResponse('Failed to insert category', {
                status: 500,
            });
        }

        await client.query('COMMIT');

        return NextResponse.json({ messages: `Category created with name of ${categoryName}`, success: true }, {
            status: 201,
        });

    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during category creation:", error);

        return NextResponse.json({
            message: "An unexpected error occurred during category creation",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}


export async function GET() {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();
        await client.query('BEGIN');

        const checkQuery = `SELECT * FROM "CategoryMaster"`;
        const data = await client.query(checkQuery);
        const result = data.rows

        await client.query('COMMIT');

        return NextResponse.json(
            result, { status: 200 }
        );

    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during category fetching:", error);

        return NextResponse.json({
            message: "An unexpected error occurred during category fetching",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}


