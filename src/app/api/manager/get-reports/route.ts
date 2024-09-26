import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";
import moment from "moment";

const typedPool: Pool = pool as Pool;

export async function GET(request: Request) {
    let client: PoolClient | null = null;

    const { searchParams } = new URL(request.url);
    const dateFromUrl = searchParams.get('date');
    const formattedDate = moment().format('YYYY-MM-DD');
    let dateSearch = formattedDate;

    if (dateFromUrl) {
        const isValidDate = moment(dateFromUrl, 'YYYY-MM-DD', true).isValid();
        dateSearch = isValidDate ? dateFromUrl : formattedDate;
    }
    console.log('dateSearch::: ', dateSearch);

    try {
        client = await typedPool.connect();
        await client.query('BEGIN');

        const reportResult = await client.query(
            `SELECT 
                bill_entry_id, 
                billno, 
                total_amount, 
                is_paid,order_type, 
                payment_mod,
                (SELECT COALESCE(SUM(total_amount), 0) FROM "BillEntry" WHERE created_at::date = $1) AS total_sales
             FROM "BillEntry"
             WHERE created_at::date = $1
             ORDER BY bill_entry_id DESC`,
            [dateSearch]
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data = reportResult.rows.map(({ total_sales, ...rest }) => rest);
        const totalSales = data.length > 0 ? reportResult.rows[0].total_sales : 0;

        await client.query('COMMIT');

        return NextResponse.json({
            success: true,
            data,
            totalSales
        }, { status: 200 });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error("Error during Report Fetching:", error);

        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred during Report Fetching",
            success: false
        }, { status: 500 });

    } finally {
        if (client) client.release();
    }
}
