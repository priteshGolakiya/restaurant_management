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

        const updateFields: string[] = [];
        const updateValues: unknown[] = [];
        let parameterIndex = 1;

        if (typeof isActive === 'boolean') {
            updateFields.push(`"isActive" = $${parameterIndex}`);
            updateValues.push(isActive);
            parameterIndex++;
        }

        if (typeof isReserved === 'boolean') {
            if (isReserved === false) {
                updateFields.push(`"isReserved" = $${parameterIndex}`);
                updateFields.push(`"time_to" = NULL`);
                updateFields.push(`"time_end" = NULL`);
                updateFields.push(`"note" = NULL`);
                updateValues.push(isReserved);
                parameterIndex++;
            } else {
                updateFields.push(`"isReserved" = $${parameterIndex}`);
                updateValues.push(isReserved);
                parameterIndex++;
            }
        }

        if (updateFields.length > 0) {
            const updateQuery = `UPDATE "TableMaster" SET ${updateFields.join(', ')} WHERE tableid = $${parameterIndex}`;
            updateValues.push(tableid);
            await client.query(updateQuery, updateValues);
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