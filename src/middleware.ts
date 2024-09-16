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

    if (!token) {
        return redirectToLogin(request, "Please log in to access this page");
    }

    try {
        const user = await decodeToken(token);

        if (!user.isactive || user.role !== 'admin') {
            return redirectToLogin(request, "Access denied. Admins only.");
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return redirectToLogin(request, "Invalid or expired token. Please log in again.");
    }
}

function redirectToLogin(request: NextRequest, message: string) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('message', message);
    return NextResponse.redirect(url);
}

async function decodeToken(token: string): Promise<JwtPayload> {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

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
    matcher: ['/admin/:path*'],
};