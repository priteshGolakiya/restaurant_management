import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

interface JwtPayload extends JWTPayload {
    userid: string;
    isactive: boolean;
    user_name: string;
    role: string;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (token) {
        try {
            const user = await decodeToken(token);
            console.log('user::: ', user);

            if (user && user.role === 'admin') {
                return NextResponse.next();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    return NextResponse.redirect(new URL('/login', request.url));
}

async function decodeToken(token: string): Promise<JwtPayload> {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    console.log('Decoded token payload:', payload);

    if (!isJwtPayload(payload)) {
        throw new Error('Invalid token payload');
    }

    return payload;
}

function isJwtPayload(payload: JWTPayload): payload is JwtPayload {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'userid' in payload &&
        'isactive' in payload &&
        'user_name' in payload &&
        'role' in payload
    );
}

export const config = {
    matcher: '/admin/:path*',
};