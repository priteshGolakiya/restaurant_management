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
    const path = request.nextUrl.pathname;

    console.log("Path requested:", path);
    console.log("Token found:", token);

    if (!token) {
        return redirectToLogin(request, "Please log in to access this page");
    }

    try {
        const user = await decodeToken(token);

        console.log("User decoded from token:", user);

        if (!user.isactive) {
            return redirectToLogin(request, "Your account is not active. Please contact support.");
        }

        const allowedPaths = {
            admin: ['/admin'],
            waiter: ['/waiter'],
            manager: ['/manager']
        };

        const userAllowedPaths = allowedPaths[user.role as keyof typeof allowedPaths] || [];
        console.log("User allowed paths:", userAllowedPaths);

        if (user.role === 'admin') {
            return NextResponse.next();
        } else if (!userAllowedPaths.some(allowedPath => path.startsWith(allowedPath))) {
            return redirectToAllowedPath(request, user.role, "You don't have access to this page.");
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

function redirectToAllowedPath(request: NextRequest, role: string, message: string) {
    const url = request.nextUrl.clone();
    switch (role) {
        case 'admin':
            url.pathname = '/admin';
            break;
        case 'waiter':
            url.pathname = '/waiter';
            break;
        case 'manager':
            url.pathname = '/manager';
            break;
        default:
            url.pathname = '/';
    }
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
    matcher: ['/admin/:path*', '/waiter/:path*', '/manager/:path*'],
};