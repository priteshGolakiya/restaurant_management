import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";


const typedPool: Pool = pool as Pool;

export async function GET(request: Request, { params }: { params: { tableId: string } }) {
    const tableNumber = params.tableId;

    if (!tableNumber) {
        return NextResponse.json({
            message: "Table Id is required",
            success: false
        }, { status: 400 });
    }

    let client: PoolClient | null = null;

    try {

        client = await typedPool.connect();
        await client.query('BEGIN');


        const billEntriesResult = await client.query(
            `SELECT bill_entry_id FROM "BillEntry"
             WHERE table_number = $1 AND is_paid = false
             ORDER BY created_at DESC`,
            [tableNumber]
        );


        if (billEntriesResult.rowCount === 0) {
            return NextResponse.json({
                message: "No active orders found for this table",
                success: false
            }, { status: 404 });
        }


        const billEntry = billEntriesResult.rows[0];


        const billDetailResult = await client.query(
            `SELECT bill_details_id,item_id,quantity,subtotal,note,kotno,bill_entry_id FROM "BillDetail"
             WHERE bill_entry_id = $1
             ORDER BY kotno`,
            [billEntry.bill_entry_id]
        );

        const billDetail = billDetailResult.rows;


        await client.query('COMMIT');


        return NextResponse.json({
            orders: billDetail,
            success: true
        }, { status: 200 });

    } catch (error) {

        if (client) {
            await client.query('ROLLBACK');
        }
        console.error("Error during Order Fetching:", error);


        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred during Order Fetching",
            success: false
        }, { status: 500 });

    } finally {

        if (client) client.release();
    }
}

interface OrderData {
    itemId: string;
    quantity: number;
    note: string | null;
    billDetailsId: number;
}

function validateOrderData(data: OrderData): { isValid: boolean; error?: string } {
    if (typeof data.billDetailsId !== 'string' || data.billDetailsId <= 0) {
        return { isValid: false, error: "Invalid billDetailsId" };
    }

    if (typeof data.itemId !== 'string' || data.itemId.trim() === '') {
        return { isValid: false, error: "Invalid itemId" };
    }

    if (typeof data.quantity !== 'number' || data.quantity <= 0) {
        return { isValid: false, error: "Invalid quantity" };
    }

    if (data.note !== null && typeof data.note !== 'string') {
        return { isValid: false, error: "Note must be null or a string" };
    }

    return { isValid: true };
}

export async function PUT(request: Request) {
    let client: PoolClient | null = null;

    try {
        const data = await request.json();
        const validation = validateOrderData(data);
        if (!validation.isValid) {
            return NextResponse.json({
                message: validation.error,
                success: false
            }, { status: 400 });
        }

        const { itemId, quantity, note, billDetailsId } = data as OrderData;

        client = await typedPool.connect();
        await client.query('BEGIN');

        const billDetailResult = await client.query(
            'SELECT bd.bill_entry_id, be.is_paid FROM "BillDetail" bd JOIN "BillEntry" be ON bd.bill_entry_id = be.bill_entry_id WHERE bd.bill_details_id = $1',
            [billDetailsId]
        );

        if (billDetailResult.rows.length === 0) {
            throw new Error("Bill detail not found");
        }

        const { bill_entry_id, is_paid } = billDetailResult.rows[0];

        if (is_paid) {
            throw new Error("Cannot update a paid bill");
        }

        const itemResult = await client.query(
            'SELECT price FROM "ItemMaster" WHERE itemid = $1',
            [itemId]
        );

        if (itemResult.rows.length === 0) {
            throw new Error("Item not found");
        }

        const { price } = itemResult.rows[0];
        const newSubtotal = quantity * price;

        const currentSubtotalResult = await client.query(
            'SELECT subtotal FROM "BillDetail" WHERE bill_details_id = $1',
            [billDetailsId]
        );

        const currentSubtotal = currentSubtotalResult.rows[0].subtotal;

        await client.query(
            'UPDATE "BillDetail" SET item_id = $1, quantity = $2, subtotal = $3, note = $4 WHERE bill_details_id = $5',
            [itemId, quantity, newSubtotal, note, billDetailsId]
        );

        await client.query(
            'UPDATE "BillEntry" SET total_amount = total_amount - $1 + $2, updated_at = CURRENT_TIMESTAMP WHERE bill_entry_id = $3',
            [currentSubtotal, newSubtotal, bill_entry_id]
        );

        await client.query('COMMIT');

        return NextResponse.json({
            message: "Order updated successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error("Error during Order Updating:", error);

        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred during Order Updating",
            success: false
        }, { status: 500 });

    } finally {
        if (client) client.release();
    }
}


export async function DELETE(request: Request) {
    let client: PoolClient | null = null;

    try {
        const data = await request.json();

        const { billDetailsId } = data;

        if (!billDetailsId || typeof billDetailsId !== 'number' || billDetailsId <= 0) {
            return NextResponse.json({
                message: "Invalid billDetailsId",
                success: false
            }, { status: 400 });
        }

        client = await typedPool.connect();
        await client.query('BEGIN');

        const billDetailResult = await client.query(
            `SELECT bd.bill_entry_id, bd.subtotal, be.is_paid 
             FROM "BillDetail" bd 
             JOIN "BillEntry" be ON bd.bill_entry_id = be.bill_entry_id 
             WHERE bd.bill_details_id = $1`,
            [billDetailsId]
        );

        if (billDetailResult.rows.length === 0) {
            throw new Error("Bill detail not found");
        }

        const { bill_entry_id, subtotal, is_paid } = billDetailResult.rows[0];

        if (is_paid) {
            throw new Error("Cannot delete an item from a paid bill");
        }

        await client.query(
            'DELETE FROM "BillDetail" WHERE bill_details_id = $1',
            [billDetailsId]
        );

        await client.query(
            `UPDATE "BillEntry" 
             SET total_amount = total_amount - $1, 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE bill_entry_id = $2`,
            [subtotal, bill_entry_id]
        );

        await client.query('COMMIT');

        return NextResponse.json({
            message: "Order item deleted successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error("Error during Order Item Deletion:", error);

        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred during Order Item Deletion",
            success: false
        }, { status: 500 });

    } finally {
        if (client) client.release();
    }
}