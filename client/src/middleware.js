import { NextResponse } from 'next/server';

export function middleware(req) {
    const auth= req.cookies.get('token');
    const isAuthPage = req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up';
    
    if (isAuthPage) {
        if (auth) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    } else {
        if (!auth) {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/'
    ],
};