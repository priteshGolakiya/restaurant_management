import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export async function GET(req: Request) {
    Cookies.remove('token');
    return NextResponse.redirect(new URL('/login', req.url));
}