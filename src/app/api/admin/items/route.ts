import { NextResponse } from 'next/server';
import { PoolClient, Pool } from 'pg';
import pool from '@/lib/db';

const typedPool: Pool = pool as Pool;

export async function POST(request: Request) {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();
        await client.query('BEGIN');

        const { itemname, description, price, categoryid, itemimage } = await request.json();
        const numbcategoryid = Number(categoryid)

        if (!itemname || typeof itemname !== 'string') {
            return new NextResponse('Invalid item name', { status: 400 });
        }
        if (description && typeof description !== 'string') {
            return new NextResponse('Invalid description', { status: 400 });
        }
        if (typeof price !== 'number' || price <= 0) {
            return new NextResponse('Invalid price', { status: 400 });
        }
        if (typeof numbcategoryid !== 'number' || numbcategoryid <= 0) {
            return new NextResponse('Invalid category ID', { status: 400 });
        }
        if (itemimage && typeof itemimage !== 'string') {
            return new NextResponse('Invalid item image URL', { status: 400 });
        }

        const checkQuery = 'SELECT * FROM "ItemMaster" WHERE "itemname" = $1';
        const result = await client.query(checkQuery, [itemname]);

        if (result.rows.length > 0) {
            await client.query('ROLLBACK');
            return new NextResponse('Item already exists', { status: 400 });
        }

        const itemJson = {
            "img1": itemimage
        }

        const insertQuery = 'INSERT INTO "ItemMaster" ("itemname", "description", "price", "categoryid", "itemimage", "isactive") VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *';
        const insertResult = await client.query(insertQuery, [itemname, description, price, numbcategoryid, itemJson]);
        const itemData = insertResult.rows[0];

        await client.query('COMMIT');

        return new NextResponse(JSON.stringify({ itemData }), { status: 201 });

    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during item creation:", error);

        return NextResponse.json({
            message: "An unexpected error occurred during item creation",
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

        const checkQuery = `SELECT * FROM "ItemMaster"`;
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
