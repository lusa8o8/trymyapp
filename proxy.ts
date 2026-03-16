import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const publicRoutes = ['/', '/browse', '/login', '/signup', '/creators']
  const isPublicRoute =
    publicRoutes.some(route => pathname === route) ||
    pathname.startsWith('/apps/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (isPublicRoute) {
    return response
  }

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'tester'

  const isDeveloperRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/submit')

  const isTesterRoute = pathname.startsWith('/tests')
  const isAdminRoute = pathname.startsWith('/admin')

  if (isDeveloperRoute && role !== 'developer' && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isTesterRoute && role !== 'tester' && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
