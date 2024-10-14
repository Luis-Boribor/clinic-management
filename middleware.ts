import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/'
    const isAdminPath = path.startsWith('/admin')

    const adminToken = request.cookies.get('token')?.value || ''
    const req = request
    const userToken = await getToken({ req, secret: process.env.AUTH_SECRET})

    if (isPublicPath) {
        if (userToken) {
            return NextResponse.redirect(new URL('/user/dashboard', request.nextUrl))
        }
        else if (adminToken) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl))
        }
    }

    if (isAdminPath && !adminToken) {
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
    matcher: [
      '/',
      '/admin/:path*',
      '/user/:path*'
    ],
}