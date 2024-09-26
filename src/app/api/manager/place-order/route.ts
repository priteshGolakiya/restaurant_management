// import { NextResponse } from "next/server";
// import { PoolClient, Pool } from 'pg';
// import pool from "@/lib/db";

// const typedPool: Pool = pool as Pool;

// interface OrderItem {
//     itemId: string;
//     quantity: number;
//     note: string | null;
// }

// interface OrderData {
//     tableNumber: number;
//     items: OrderItem[];
//     orderType: string;
//     paymentMethod: string
// }

// function validateOrderData(data: OrderData): { isValid: boolean; error?: string } {
//     if (typeof data.tableNumber !== 'number' || data.tableNumber <= 0) {
//         return { isValid: false, error: "Invalid table number" };
//     }
//     if (typeof data.orderType !== 'string' || (data.orderType !== 'dynein' && data.orderType !== 'takeaway')) {
//         return { isValid: false, error: "Invalid order type" };
//     }
//     if (typeof data.paymentMethod !== "string" || data.paymentMethod.trim() === "" || (data.paymentMethod !== "upi" && data.paymentMethod !== "cash" && data.paymentMethod !== "card")) {
//         return { isValid: false, error: "Invalid payment method" };
//     }
//     if (!Array.isArray(data.items) || data.items.length === 0) {
//         return { isValid: false, error: "Items must be a non-empty array" };
//     }

//     for (const item of data.items) {
//         if (typeof item.itemId !== 'string' || item.itemId.trim() === '') {
//             return { isValid: false, error: "Invalid itemId" };
//         }

//         if (typeof item.quantity !== 'number' || item.quantity <= 0) {
//             return { isValid: false, error: "Invalid quantity" };
//         }

//         if (item.note !== null && typeof item.note !== 'string') {
//             return { isValid: false, error: "Note must be null or a string" };
//         }
//     }

//     return { isValid: true };
// }

// async function getNextBillNumber(client: PoolClient): Promise<number> {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const result = await client.query(
//         'SELECT COUNT(*) as count FROM "BillEntry" WHERE created_at >= $1',
//         [todayStart]
//     );

//     return result.rows[0].count + 1;
// }

// async function getNextKotNumber(client: PoolClient, billEntryId: number): Promise<number> {
//     const result = await client.query(
//         'SELECT COALESCE(MAX(kotno), 0) as max_kotno FROM "BillDetail" WHERE bill_entry_id = $1',
//         [billEntryId]
//     );

//     return result.rows[0].max_kotno + 1;
// }

// async function getNextOrderId(client: PoolClient): Promise<number> {
//     const result = await client.query(
//         'SELECT COALESCE(MAX(order_id), 0) as max_order_id FROM "BillDetail"'
//     );

//     return Number(result.rows[0].max_order_id) + 1;
// }

// export async function POST(request: Request) {
//     let client: PoolClient | null = null;
//     const userData = request.headers.get('x-user-data');
//     let userId = null

//     if (userData) {
//         const parsedUserData = JSON.parse(userData);
//         userId = parsedUserData.userid
//     } else {
//         console.log("User id not found for placing order");
//     }
//     try {
//         const data = await request.json();
//         const validation = validateOrderData(data);

//         if (!validation.isValid) {
//             return NextResponse.json({
//                 message: validation.error,
//                 success: false
//             }, { status: 400 });
//         }

//         const { tableNumber, items } = data as OrderData;

//         client = await typedPool.connect();
//         await client.query('BEGIN');

//         const tableExistenceResult = await client.query(
//             'SELECT tableid FROM "TableMaster" WHERE tableid = $1',
//             [tableNumber]
//         );

//         if (tableExistenceResult.rows.length === 0) {
//             throw new Error("Table does not exist");
//         }

//         const existingBillResult = await client.query(
//             'SELECT bill_entry_id, billno FROM "BillEntry" WHERE table_number = $1 AND is_paid = FALSE ORDER BY created_at DESC LIMIT 1',
//             [tableNumber]
//         );

//         let billEntryId: number, billNo: number;
//         if (existingBillResult.rows.length > 0) {
//             billEntryId = existingBillResult.rows[0].bill_entry_id;
//             billNo = existingBillResult.rows[0].billno;
//         } else {
//             billNo = await getNextBillNumber(client);

//             const newBillEntryResult = await client.query(
//                 'INSERT INTO "BillEntry" (billno, bill_date, total_amount, created_at, updated_at, create_by, update_by, table_number, is_paid) VALUES ($1, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $2, 1, $3, FALSE) RETURNING bill_entry_id',
//                 [billNo, userId, tableNumber]
//             );
//             billEntryId = newBillEntryResult.rows[0].bill_entry_id;
//         }

//         const kotno = await getNextKotNumber(client, billEntryId);
//         const orderId = await getNextOrderId(client);

//         for (const item of items) {
//             const { itemId, quantity, note } = item;

//             const existingItemResult = await client.query(
//                 'SELECT price FROM "ItemMaster" WHERE itemid = $1',
//                 [itemId]
//             );

//             if (existingItemResult.rows.length === 0) {
//                 throw new Error(`Item with id ${itemId} not found`);
//             }

//             const { price } = existingItemResult.rows[0];
//             const subtotal = quantity * price;

//             await client.query(
//                 'INSERT INTO "BillDetail" (order_id, bill_entry_id, subtotal, quantity, note, kotno, item_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)',
//                 [orderId, billEntryId, subtotal, quantity, note || null, kotno, itemId]
//             );

//             await client.query(
//                 'UPDATE "BillEntry" SET total_amount = total_amount + $1, updated_at = CURRENT_TIMESTAMP WHERE bill_entry_id = $2',
//                 [subtotal, billEntryId]
//             );
//         }

//         await client.query('COMMIT');

//         return NextResponse.json({
//             message: "Order placed successfully",
//             success: true,
//             billEntryId,
//             billNo,
//             kotno
//         }, { status: 200 });
//     } catch (error) {
//         if (client) await client.query('ROLLBACK');

//         console.error("Error during Order creation:", error);

//         return NextResponse.json({
//             message: error instanceof Error ? error.message : "An unexpected error occurred during Order creation",
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

interface OrderItem {
    itemId: string;
    quantity: number;
    note: string | null;
}

interface OrderData {
    tableNumber: number | null;
    items: OrderItem[];
    orderType: 'dinein' | 'takeaway';
    paymentMethod: 'upi' | 'cash' | 'card';
}

function validateOrderData(data: OrderData): { isValid: boolean; error?: string } {
    if (data.orderType === 'dinein' && (typeof data.tableNumber !== 'number' || data.tableNumber <= 0)) {
        return { isValid: false, error: "Invalid table number for dine-in order" };
    }
    if (data.orderType === 'takeaway' && data.tableNumber !== null) {
        return { isValid: false, error: "Table number should be null for takeaway orders" };
    }
    if (data.orderType !== 'dinein' && data.orderType !== 'takeaway') {
        return { isValid: false, error: "Invalid order type" };
    }
    // if (!['upi', 'cash', 'card'].includes(data.paymentMethod)) {
    //     return { isValid: false, error: "Invalid payment method" };
    // }
    if (!Array.isArray(data.items) || data.items.length === 0) {
        return { isValid: false, error: "Items must be a non-empty array" };
    }

    for (const item of data.items) {
        if (typeof item.itemId !== 'string' || item.itemId.trim() === '') {
            return { isValid: false, error: "Invalid itemId" };
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
            return { isValid: false, error: "Invalid quantity" };
        }
        if (item.note !== null && typeof item.note !== 'string') {
            return { isValid: false, error: "Note must be null or a string" };
        }
    }

    return { isValid: true };
}

async function getNextBillNumber(client: PoolClient): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await client.query(
        'SELECT COUNT(*) as count FROM "BillEntry" WHERE created_at >= $1',
        [todayStart]
    );

    return Number(result.rows[0].count) + 1;
}

async function getNextKotNumber(client: PoolClient, billEntryId: number): Promise<number> {
    const result = await client.query(
        'SELECT COALESCE(MAX(kotno), 0) as max_kotno FROM "BillDetail" WHERE bill_entry_id = $1',
        [billEntryId]
    );

    return result.rows[0].max_kotno + 1;
}

async function getNextTokenNumber(client: PoolClient): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await client.query(
        'SELECT COALESCE(MAX(token_no), 0) as max_token_no FROM "BillEntry" WHERE created_at >= $1 AND order_type = $2',
        [todayStart, 'takeaway']
    );

    return result.rows[0].max_token_no + 1;
}

async function getNextOrderId(client: PoolClient): Promise<number> {
    const result = await client.query(
        'SELECT COALESCE(MAX(order_id), 0) as max_order_id FROM "BillDetail"'
    );

    return Number(result.rows[0].max_order_id) + 1;
}

export async function POST(request: Request) {
    let client: PoolClient | null = null;
    const userData = request.headers.get('x-user-data');
    let userId = null;

    if (userData) {
        const parsedUserData = JSON.parse(userData);
        userId = parsedUserData.userid;
    } else {
        console.log("User id not found for placing order");
    }

    try {
        const data = await request.json();
        const validation = validateOrderData(data);

        if (!validation.isValid) {
            console.log('validation::: ', validation);
            return NextResponse.json({
                message: validation.error,
                success: false
            }, { status: 400 });
        }

        const { tableNumber, items, orderType, paymentMethod } = data as OrderData;

        client = await typedPool.connect();
        await client.query('BEGIN');

        if (orderType === 'dinein') {
            const tableExistenceResult = await client.query(
                'SELECT tableid FROM "TableMaster" WHERE tableid = $1',
                [tableNumber]
            );

            if (tableExistenceResult.rows.length === 0) {
                throw new Error("Table does not exist");
            }
        }

        const billNo = await getNextBillNumber(client);
        const tokenNo = orderType === 'takeaway' ? await getNextTokenNumber(client) : null;

        const newBillEntryResult = await client.query(
            'INSERT INTO "BillEntry" (billno, bill_date, total_amount, created_at, updated_at, create_by, update_by, table_number, is_paid, payment_mod, order_type, token_no) VALUES ($1, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $2, $2, $3, $4, $5, $6, $7) RETURNING bill_entry_id',
            [billNo, userId, tableNumber, orderType === 'takeaway', paymentMethod, orderType, tokenNo]
        );
        const billEntryId = newBillEntryResult.rows[0].bill_entry_id;

        const kotno = await getNextKotNumber(client, billEntryId);
        const orderId = await getNextOrderId(client);

        for (const item of items) {
            const { itemId, quantity, note } = item;

            const existingItemResult = await client.query(
                'SELECT price FROM "ItemMaster" WHERE itemid = $1',
                [itemId]
            );

            if (existingItemResult.rows.length === 0) {
                throw new Error(`Item with id ${itemId} not found`);
            }

            const { price } = existingItemResult.rows[0];
            const subtotal = quantity * price;

            await client.query(
                'INSERT INTO "BillDetail" (order_id, bill_entry_id, subtotal, quantity, note, kotno, item_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)',
                [orderId, billEntryId, subtotal, quantity, note || null, kotno, itemId]
            );

            await client.query(
                'UPDATE "BillEntry" SET total_amount = total_amount + $1, updated_at = CURRENT_TIMESTAMP WHERE bill_entry_id = $2',
                [subtotal, billEntryId]
            );
        }

        await client.query('COMMIT');

        return NextResponse.json({
            message: "Order placed successfully",
            success: true,
            billEntryId,
            billNo,
            kotno,
            tokenNo: orderType === 'takeaway' ? tokenNo : null
        }, { status: 200 });
    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during Order creation:", error);

        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred during Order creation",
            success: false
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}