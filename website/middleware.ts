import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export function middleware(request: NextRequest) {
    console.log("MIDDLEWARE LOG:");
    console.log("True");
    let cookie = request.cookies.get('session_id');

    if (!cookie) {
        return NextResponse.redirect("/")
    }

    const response = NextResponse.next();
    return response
}

export const config = {
    matcher: "/dashboard/:path*"
}