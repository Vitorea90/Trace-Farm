import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

    // Check if it's a dashboard route
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        // Check for auth token
        const token = request.cookies.get('auth_token')

        if (!token) {
            // Redirect to login if no token found
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*',
}
