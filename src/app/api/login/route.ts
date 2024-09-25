
import { NextResponse } from 'next/server';
import { PoolClient, Pool } from 'pg';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const typedPool: Pool = pool as Pool;

interface PgError extends Error {
    code?: string;
}

export async function POST(req: Request) {
    let client: PoolClient | null = null;
    try {
        const { email, password } = await req.json();
        client = await typedPool.connect();

        await client.query('BEGIN');

        const query = `
            SELECT u.*, r.rolename
            FROM "Users" u
            JOIN "RoleMaster" r ON u.role = r.roleid
            WHERE u.email = $1
        `;
        const { rows } = await client.query(query, [email]);
        const foundData = rows[0];

        if (!foundData) {
            return NextResponse.json({ message: 'User not found', success: false }, { status: 404 });
        }

        const checkPassword = await bcrypt.compare(password, foundData.password);
        if (!checkPassword) {
            return NextResponse.json({ message: 'Invalid password', success: false }, { status: 401 });
        }

        const payload = {
            userid: foundData.userid,
            isactive: foundData.isactive,
            user_name: foundData.user_name,
            role: foundData.rolename
        };

        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1d')
            .sign(secret);

        await client.query('COMMIT');

        const response = NextResponse.json({
            message: "Login successful",
            payload,
            success: true,
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: false,
            maxAge: 24 * 60 * 60,
            path: '/',
            sameSite: 'strict',
        });

        return response;

    } catch (error) {
        if (client) await client.query('ROLLBACK');

        console.error("Error during Login:", error);

        const pgError = error as PgError;

        if (pgError.code === '23502') {
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
