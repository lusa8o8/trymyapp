import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/', '/browse', '/login', '/signup', '/creators'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/apps/') || pathname.startsWith('/api/') || pathname.startsWith('/auth/')
  );

  if (isPublicRoute) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  let role = 'tester';
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role || 'tester';
  } catch {
    // Default to tester role if profile lookup fails
  }

  const developerRoutes = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/submit') ||
                          pathname.startsWith('/apps/') && pathname.includes('/analytics') ||
                          pathname.startsWith('/apps/') && pathname.includes('/report');

  if (developerRoutes && role !== 'developer' && role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const testerRoutes = pathname.startsWith('/tests');
  if (testerRoutes && role !== 'tester' && role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const adminRoutes = pathname.startsWith('/admin');
  if (adminRoutes && role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
