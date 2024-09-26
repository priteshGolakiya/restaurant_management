import { NextResponse } from "next/server"
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";

const typedPool: Pool = pool as Pool;

interface TableData {
    tableid: string;
    noOfSeats: number;
    tableNumber: number;
    isReserved: boolean;
    isActive: boolean;
    time_to: Date;
    time_end: Date;
    note: string;
    status: string;
}

interface TableStatus {
    tablesNeedingAttention: TableData[];
    timestamp: string;
}

// function categorizeTableStatus(table: TableData): string {
//     const now = new Date();
//     if (table.isReserved && table.isActive && table.time_end <= now) {
//         return 'Reservation Ending';
//     } else if (!table.isReserved && !table.isActive) {
//         return 'Needs Cleaning';
//     } else if (table.isReserved && !table.isActive && table.time_to <= now) {
//         return 'Ready for Seating';
//     }
//     return 'OK';
// }

export async function GET() {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();

        const query = `
             SELECT * FROM "TableMaster"
            WHERE is_available = false   
            ORDER BY "tableNumber"
        `;
        // const query = `
        //     SELECT * FROM "TableMaster" 
        //     WHERE (
        //         ("isReserved" = true AND "isActive" = true AND "time_end" <= CURRENT_TIMESTAMP + INTERVAL '30 minutes')
        //         OR ("isReserved" = false AND "isActive" = false)
        //         OR ("isReserved" = true AND "isActive" = false AND "time_to" <= CURRENT_TIMESTAMP)
        //     )
        //     ORDER BY 
        //         CASE 
        //             WHEN "isReserved" = true AND "isActive" = true THEN "time_end"
        //             WHEN "isReserved" = true AND "isActive" = false THEN "time_to"
        //             ELSE CURRENT_TIMESTAMP
        //         END ASC
        // `;

        const { rows } = await client.query<TableData>(query);

        const tablesWithStatus: TableData[] = rows.map(table => ({
            ...table,
            // status: categorizeTableStatus(table)
        }));

        const tableStatus: TableStatus = {
            tablesNeedingAttention: tablesWithStatus,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(
            { result: tableStatus, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching table data:", error);

        return NextResponse.json({
            message: "An unexpected error occurred while fetching table data",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}