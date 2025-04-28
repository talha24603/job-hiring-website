  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';

  import { getToken } from 'next-auth/jwt';
  import { auth } from './auth';

  interface Token {
    
      role?: string;
      // ... other user properties
    
  }

  export async function middleware(request: NextRequest) {
    const secret = process.env.AUTH_SECRET;
    const token = (await getToken({ req: request, secret })) as Token | null;
    // const session = await auth();
    // const token = session?.user as { role?: string } | null; // Adjust the type according to your user object structure
    const url = request.nextUrl;

    // Redirect UNASSIGNED roles to select role
    if (token?.role === "UNASSIGNED" && url.pathname !== '/select-role') {
      return NextResponse.redirect(new URL('/select-role', request.url))
    }

    // Prevent employers from accessing job application forms
    if (token?.role === "employer" && url.pathname.startsWith('/apply-job-form')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect non-employers from employer-specific routes
    if (
      token &&
      token.role !== "employer" && // Check role first
      (
        url.pathname.startsWith('/posted-job') ||
        url.pathname === '/employer-profile' ||
        url.pathname === '/post-job' ||
        url.pathname.startsWith('/edit-job')
      )
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect authenticated users from auth pages
    if (
      token &&
      (url.pathname === '/login' ||
        url.pathname === '/sign-up' ||
        url.pathname.startsWith('/verifyCode'))
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Protect routes from unauthenticated users
    if (
      !token &&
      (
        url.pathname === '/select-role' ||
        url.pathname === '/post-job' ||
        url.pathname === '/employer-profile' ||
        url.pathname === '/edit-profile' ||
        url.pathname.startsWith('/apply-job-form') ||
        url.pathname.startsWith('/posted-job') ||
        url.pathname.startsWith('/edit-job') ||
        url.pathname.startsWith('/job-applications')

      )
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  // Config remains the same
  export const config = {
    matcher: [
      '/verifyCode/:path*',
      '/login',
      '/sign-up',
      '/',
      '/select-role',
      '/employer-profile',
      '/post-job',
      '/apply-job/:path*',
      '/apply-job-form/:path*',
      '/posted-job/:path*',
      '/coming-soon',
      '/contact-us',
      '/edit-job/:path*',
      '/about-us',
      '/job-applications/:path*',
      '/view-application/:path*',
    ],
  };