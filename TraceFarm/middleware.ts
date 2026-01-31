import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

    // Check if it's a dashboard route
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('auth_token')
        const role = request.cookies.get('auth_role')

        // Allow 'coop' (and legacy 'producer' if any) to view dashboard
        if (!token || (role?.value !== 'coop' && role?.value !== 'producer' && role?.value !== 'admin')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Check if it's an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth_token')
        const role = request.cookies.get('auth_role')

        if (!token || role?.value !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
