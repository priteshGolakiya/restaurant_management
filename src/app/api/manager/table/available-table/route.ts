// import { NextResponse } from "next/server";
// import { PoolClient, Pool } from 'pg';
// import pool from "@/lib/db";

// const typedPool: Pool = pool as Pool;

// interface TableData {
//     tableid: string;
//     noOfSeats: number;
//     tableNumber: number;
//     is_available: boolean;
// }

// interface AvailableTableStatus {
//     availableTables: TableData[];
//     timestamp: string;
// }

// export async function GET() {
//     let client: PoolClient | null = null;
//     try {
//         client = await typedPool.connect();

//         const query = `
//             SELECT * FROM "TableMaster"
//             WHERE is_available = true
//             ORDER BY "tableNumber"
//         `;

//         const { rows } = await client.query(query);

//         const availableTableStatus: AvailableTableStatus = {
//             availableTables: rows,
//             timestamp: new Date().toISOString()
//         };

//         return NextResponse.json(
//             { result: availableTableStatus, success: true },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error fetching available table data:", error);

//         return NextResponse.json({
//             message: "An unexpected error occurred while fetching available table data",
//             success: false
//         }, { status: 500 });
//     } finally {
//         if (client) client.release();
//     }
// }

import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";
import moment from "moment";

const typedPool: Pool = pool as Pool;

interface TableData {
    tableid: string;
    noOfSeats: number;
    tableNumber: number;
    is_available: boolean;
}

interface AvailableTableStatus {
    availableTables: TableData[];
    timestamp: string;
}

export async function GET() {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();

        const formattedDate = moment(Date.now()).format('YYYY-MM-DD');

        const query = `select * from "TableMaster" where "tableid" not in (select table_number from "BillEntry" where "bill_date"::date = $1 AND is_paid = false) 
            ORDER BY "tableNumber"`;

        const { rows } = await client.query(query, [formattedDate]);

        const availableTableStatus: AvailableTableStatus = {
            availableTables: rows,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(
            { result: availableTableStatus, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching available table data:", error);

        return NextResponse.json({
            message: "An unexpected error occurred while fetching available table data",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}