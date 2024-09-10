import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";

const typedPool: Pool = pool as Pool;




export async function PUT(req: Request, { params }: { params: { id: string } }) {
    let client: PoolClient | null = null;
    try {
        const { fullName, userName, email, role } = await req.json();
        const { id } = params;

        console.log("Received data:", { id, fullName, userName, email, role });

        if (!fullName || !userName || !email) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        client = await typedPool.connect();
        await client.query('BEGIN');

        let roleId;
        if (role) {
            const roleQuery = await client.query('SELECT roleid FROM "RoleMaster" WHERE LOWER(rolename) = LOWER($1) AND isactive = true', [role]);
            if (roleQuery.rows.length > 0) {
                roleId = roleQuery.rows[0].roleid;
            } else {
                await client.query('ROLLBACK');
                return NextResponse.json({ message: 'Invalid or inactive role' }, { status: 400 });
            }
        } else {
            roleId = 3;
        }

        const updateQuery = `
            UPDATE "Users"
            SET full_name = $1, user_name = $2, email = $3, role = $4
            WHERE userid = $5
            RETURNING *;
        `;
        const values = [fullName, userName, email, roleId, id];
        const result = await client.query(updateQuery, values);

        await client.query('COMMIT');

        if (result.rows.length === 0) {
            return NextResponse.json({ message: "No user found with this ID" }, { status: 404 });
        }

        const updatedUser = result.rows[0];

        return NextResponse.json({
            message: "Staff updated successfully",
            success: true,
            user: updatedUser
        }, { status: 200 });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Error updating staff:", error);
        return NextResponse.json({
            message: "An error occurred while updating staff",
            success: false,
            error: (error as Error).message || error
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    let client: PoolClient | null = null;

    try {
        client = await typedPool.connect();
        await client.query('BEGIN');

        const existUserQuery = 'SELECT * FROM "Users" WHERE userid = $1 '
        const existUserresult = await client.query(existUserQuery, [id]);
        console.log('existUserresult::: ', existUserresult.rows);
        if (existUserresult.rows.length === 0) {
            return NextResponse.json({ message: "No user found with this ID", success: false }, {
                status:
                    404
            });
        }

        const deleteQuery = 'DELETE FROM "Users" WHERE userid = $1 RETURNING *;';
        const result = await client.query(deleteQuery, [id]);

        await client.query('COMMIT');

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "No user found with this ID" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Staff deleted successfully",
            success: true
        }, { status: 200 });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Error deleting staff:", error);
        return NextResponse.json({
            message: "An error occurred while deleting staff",
            success: false,
            error: (error as Error).message || error
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}