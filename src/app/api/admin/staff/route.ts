import { NextResponse } from "next/server";
import { PoolClient, Pool } from 'pg';
import pool from "@/lib/db";
import bcrypt from 'bcrypt';

const typedPool: Pool = pool as Pool;

interface PgError extends Error {
    code?: string;
}

export async function POST(req: Request) {
    let client: PoolClient | null = null;
    try {
        const { fullName, userName, email, password, role } = await req.json();

        client = await typedPool.connect();

        await client.query('BEGIN');

        const userNameCheck = await client.query('SELECT user_name FROM "Users" WHERE user_name = $1', [userName]);
        if (userNameCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
        }

        const emailCheck = await client.query('SELECT email FROM "Users" WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

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

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertQuery = `
            INSERT INTO "Users" (full_name, user_name, email, password, isactive, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING full_name, user_name, email, isactive, role;
        `;
        const values = [fullName, userName, email, hashedPassword, true, roleId];
        const result = await client.query(insertQuery, values);

        await client.query('COMMIT');

        const newUser = result.rows[0];

        return NextResponse.json({
            message: "Signup successful",
            success: true,
            user: newUser
        }, { status: 201 });
    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during signup:", error);

        const pgError = error as PgError;

        if (pgError.code === '23505') {
            return NextResponse.json({
                message: "Username or email already exists",
                success: false
            }, { status: 400 });
        } else if (pgError.code === '23502') {
            return NextResponse.json({
                message: "Missing required fields",
                success: false
            }, { status: 400 });
        } else {
            return NextResponse.json({
                message: "An unexpected error occurred during signup",
                success: false
            }, { status: 500 });
        }
    } finally {
        if (client) client.release();
    }
}

export async function GET() {
    let client: PoolClient | null = null;
    try {
        client = await typedPool.connect();
        const result = await client.query(`
            SELECT u.userid, u.full_name, u.user_name, u.email, rm.rolename as role
            FROM "Users" u
            LEFT JOIN "RoleMaster" rm ON u.role = rm.roleid
        `);

        const staff = result.rows;

        return NextResponse.json({
            success: true,
            staff,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching staff data"
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}



