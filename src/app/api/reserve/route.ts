// import { NextResponse } from "next/server";
// import { PoolClient, Pool } from 'pg';
// import pool from "@/lib/db";

// const typedPool: Pool = pool as Pool;

// export async function POST(request: Request) {
//     let client: PoolClient | null = null;

//     try {
//         const { customerName, customerNumber, time, selectedTables } = await request.json();

//         if (!selectedTables || !Array.isArray(selectedTables) || selectedTables.length === 0 ||
//             !customerName.trim() || customerNumber.length < 10 || !time) {
//             return NextResponse.json({ message: "Invalid data", success: false }, { status: 400 });
//         }

//         client = await typedPool.connect();
//         await client.query('BEGIN');

//         const checkTablesQuery = `
//             SELECT "tableid" FROM "TableMaster"
//             WHERE "tableid" = ANY($1::bigint[]) AND "isActive" = true AND "isReserved" = false
//         `;
//         const tableResult = await client.query(checkTablesQuery, [selectedTables]);

//         if (tableResult.rows.length !== selectedTables.length) {
//             return NextResponse.json({ message: "One or more selected tables are not available", success: false }, { status: 400 });
//         }

//         const checkReservationsQuery = `
//             SELECT "tableid" FROM "Reservations"
//             WHERE "tableid" = ANY($1::bigint[]) AND "time" = $2
//         `;
//         const reservationResult = await client.query(checkReservationsQuery, [selectedTables, time]);

//         if (reservationResult.rows.length > 0) {
//             return NextResponse.json({ message: "One or more tables are already reserved for this time", success: false }, { status: 400 });
//         }

//         const createReservationQuery = `
//             INSERT INTO "Reservations" ("tableid", "costumerName", "costumerNumber", "time")
//             VALUES ($1, $2, $3, $4)
//             RETURNING "reservationid"
//         `;

//         const reservationIds = [];
//         for (const tableid of selectedTables) {
//             const newReservation = await client.query(createReservationQuery, [tableid, customerName, customerNumber, time]);
//             reservationIds.push(newReservation.rows[0].reservationid);
//         }

//         const updateTablesQuery = `
//             UPDATE "TableMaster"
//             SET "isReserved" = true
//             WHERE "tableid" = ANY($1::bigint[])
//         `;
//         await client.query(updateTablesQuery, [selectedTables]);

//         await client.query('COMMIT');

//         return NextResponse.json({
//             message: "Reservations created successfully",
//             reservationIds,
//             success: true
//         }, { status: 201 });

//     } catch (error) {
//         if (client) await client.query('ROLLBACK');

//         console.error("Error during reservation creation:", error);

//         return NextResponse.json({
//             message: "An unexpected error occurred during reservation creation",
//             success: false
//         }, { status: 500 });
//     } finally {
//         if (client) client.release();
//     }
// }


import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";

const typedPool: Pool = pool as Pool;

export async function POST(request: Request) {
    let client: PoolClient | null = null;

    try {
        const { customerName, customerNumber, time_to, time_end, note, selectedTables } = await request.json();

        if (!selectedTables || !Array.isArray(selectedTables) || selectedTables.length === 0 ||
            !customerName.trim() || customerNumber.length < 10 || !time_to || !time_end) {
            return NextResponse.json({ message: "Invalid data", success: false }, { status: 400 });
        }

        client = await typedPool.connect();
        await client.query('BEGIN');

        const checkTablesQuery = `
            SELECT "tableid" FROM "TableMaster"
            WHERE "tableid" = ANY($1::bigint[]) AND "isActive" = true AND "isReserved" = false
        `;
        const tableResult = await client.query(checkTablesQuery, [selectedTables]);

        if (tableResult.rows.length !== selectedTables.length) {
            return NextResponse.json({ message: "One or more selected tables are not available", success: false }, { status: 400 });
        }

        const checkReservationsQuery = `
            SELECT "tableid" FROM "Reservations"
            WHERE "tableid" = ANY($1::bigint[]) AND ($2, $3) OVERLAPS ("time_to", "time_end")
        `;
        const reservationResult = await client.query(checkReservationsQuery, [selectedTables, time_to, time_end]);

        if (reservationResult.rows.length > 0) {
            return NextResponse.json({ message: "One or more tables are already reserved for this time range", success: false }, { status: 400 });
        }

        const createReservationQuery = `
            INSERT INTO "Reservations" ("tableid", "costumerName", "costumerNumber", "time_to", "time_end", "note")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING "reservationid"
        `;

        const reservationIds = [];
        for (const tableid of selectedTables) {
            const newReservation = await client.query(createReservationQuery, [tableid, customerName, customerNumber, time_to, time_end, note || null]);
            reservationIds.push(newReservation.rows[0].reservationid);
        }

        const updateTablesQuery = `
            UPDATE "TableMaster"
            SET "isReserved" = true,
                "time_to" = $2,
                "time_end" = $3,
                "note" = $4
            WHERE "tableid" = ANY($1::bigint[])
        `;
        await client.query(updateTablesQuery, [selectedTables, time_to, time_end, note || null]);

        await client.query('COMMIT');

        return NextResponse.json({
            message: "Reservations created successfully",
            reservationIds,
            success: true
        }, { status: 201 });

    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during reservation creation:", error);

        return NextResponse.json({
            message: "An unexpected error occurred during reservation creation",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
