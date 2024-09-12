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
        return NextResponse.json({ message: "Please provide a valid token" }, { status: 403 });
    }

    try {
        const user = await decodeToken(token);

        if (!user.isactive || user.role !== 'admin') {
            return NextResponse.json({ message: "Access denied. Admins only." }, { status: 403 });
        }

        return NextResponse.next();

    } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 403 });
    }
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
