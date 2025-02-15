import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {getToken} from 'next-auth/jwt';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET
  const token = await getToken({req:request,secret})
  const url = request.nextUrl
  if (token&& (url.pathname === '/login' || url.pathname === '/sign-up' || url.pathname === '/verifyCode/:path*' )) {
    
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (!token&& (url.pathname === '/' || url.pathname === '/select-role' || url.pathname === '//post-job' || url.pathname === '/employer-profile')) {
    
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/verifyCode/:path*','/login','/sign-up','/','/select-role','/employer-profile','/post-job'],
}