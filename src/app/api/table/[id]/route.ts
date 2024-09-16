import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";

const typedPool: Pool = pool as Pool;

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    let client: PoolClient | null = null;
    try {
        const { isActive, isReserved } = await req.json();
        const tableid = params.id;

        if (typeof isActive !== 'boolean' && typeof isReserved !== 'boolean') {
            return NextResponse.json({ success: false, message: "At least one of 'isActive' or 'isReserved' must be a boolean." }, { status: 400 });
        }

        client = await typedPool.connect();
        await client.query('BEGIN');

        const selectQuery = `SELECT * FROM "TableMaster" WHERE tableid = $1`;
        const result = await client.query(selectQuery, [tableid]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, message: "No items found with this ID" }, { status: 404 });
        }

        const fieldsToUpdate: string[] = [];
        const values: unknown[] = [];

        if (typeof isActive === 'boolean') {
            fieldsToUpdate.push(`"isActive" = $${fieldsToUpdate.length + 1}`);
            values.push(isActive);
        }

        if (typeof isReserved === 'boolean') {
            fieldsToUpdate.push(`"isReserved" = $${fieldsToUpdate.length + 1}`);
            values.push(isReserved);
        }

        if (fieldsToUpdate.length > 0) {
            const updateQuery = `UPDATE "TableMaster" SET ${fieldsToUpdate.join(', ')} WHERE tableid = $${fieldsToUpdate.length + 1}`;
            values.push(result.rows[0].tableid);
            await client.query(updateQuery, values);
        }

        await client.query('COMMIT');
        return NextResponse.json({
            message: "Item updated successfully",
            success: true,
        }, { status: 200 });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Error updating item:", error);
        return NextResponse.json({
            message: "An error occurred while updating the item",
            success: false,
            error: (error as Error).message || error
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}