import { NextResponse } from "next/server"
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";

const typedPool: Pool = pool as Pool;


export async function POST(request: Request) {
    let client: PoolClient | null = null;


    try {
        const { noOfSeats, tableNumber } = await request.json()

        const newNoOfSeats = Number(noOfSeats)
        const newTableNumber = Number(tableNumber)

        if (!newNoOfSeats || !newTableNumber) {
            return NextResponse.json({ message: "Please provide both noOfSeats and tableNumber" }, { status: 400, })
        }
        if (newNoOfSeats <= 0 || newTableNumber <= 0) {
            return NextResponse.json({ message: "Please provide a positive number for noOfSeats and tableNumber" }, { status: 400 })
        }

        client = await typedPool.connect();

        await client.query('BEGIN');
        const checkQuery = `SELECT * FROM "TableMaster" WHERE "tableNumber" = $1`;
        const result = await client.query(checkQuery, [newTableNumber]);

        if (result.rows.length > 0) {
            console.log("Table already exists");
            await client.query('ROLLBACK');
            return new NextResponse('Table already exists', {
                status: 400,
            });
        }

        const insertQuery = `INSERT INTO "TableMaster" ("noOfSeats","tableNumber") VALUES ($1, $2) RETURNING *`;
        const insertResult = await client.query(insertQuery, [newNoOfSeats, newTableNumber]);
        const table = insertResult.rows[0];

        if (!table || !table.tableid) {
            await client.query('ROLLBACK');
            return new NextResponse('Failed to insert category', {
                status: 500,
            });
        }


        await client.query('COMMIT');



        return NextResponse.json({
            message: "Table created successful",
            table,
            success: true,
        }, { status: 201 });
    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during Table creation:", error);

        return NextResponse.json({
            message: "An unexpected error occurred during Table creation",
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
