import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";


const typedPool: Pool = pool as Pool;


export async function PUT(request: Request, { params }: { params: { billId: string } }) {
    const { billId } = params;
    const { paymentMethod } = await request.json()

    if (!billId) {
        return NextResponse.json({
            message: "Bill Id is required",
            success: false
        }, { status: 400 });
    }
    if (typeof paymentMethod !== "string" || paymentMethod.trim() === "" || (paymentMethod !== "upi" && paymentMethod !== "cash" && paymentMethod !== "card")) {
        return NextResponse.json({
            message: "Invalid payment method",
            success: false
        }, { status: 400 });
    }


    let client: PoolClient | null = null;
    try {

        client = await typedPool.connect();
        await client.query('BEGIN');

        const billEntryResult = await client.query(
            'SELECT is_paid FROM "BillEntry"  WHERE bill_entry_id = $1',
            [billId]
        );

        console.log('billEntryResult.rows::: ', billEntryResult.rows);
        if (billEntryResult.rows.length === 0) {
            throw new Error("Bill detail not found");
        }

        const { is_paid } = billEntryResult.rows[0];

        if (is_paid) {
            return NextResponse.json({
                message: "Bill is already paid",
                success: false
            }, { status: 400 });
        }

        await client.query(
            'UPDATE "BillEntry" SET is_paid = $1 ,payment_mod = $2 WHERE bill_entry_id = $3',
            [true, paymentMethod, billId]
        );
        await client.query('COMMIT');

        return NextResponse.json({
            message: "Bill paid successfully",
            billId,
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