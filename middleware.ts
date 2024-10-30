// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  console.log('running middleware')
  const token = req.cookies.get('jwt-token')
  const protectedRoutes = ['/', '/dashboard', '/profile']
  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(`${req.nextUrl.clone().origin}/login`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard', '/profile'],
}
