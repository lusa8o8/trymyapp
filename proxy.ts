import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Static files and Next.js internals — always pass through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map)$/)
  ) {
    return NextResponse.next()
  }

  // Public routes — no auth required
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/browse' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/creators' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/') ||
    // App detail page only — not /apps/[id]/analytics or /apps/[id]/report
    (pathname.startsWith('/apps/') &&
      !pathname.includes('/analytics') &&
      !pathname.includes('/report') &&
      pathname.split('/').filter(Boolean).length === 2)

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
  console.log('middleware - pathname:', pathname)
  console.log('middleware - user:', user?.id ?? 'null', 'cookies:', request.cookies.getAll().map(c => c.name))

  // Not logged in — only public routes allowed
  if (!user) {
    if (isPublicRoute) return response
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Logged in — public routes pass through
  if (isPublicRoute) return response

  // Get role from public.users
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'tester'

  // Developer-only routes
  const isDeveloperRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/submit') ||
    (pathname.startsWith('/apps/') && (
      pathname.includes('/analytics') ||
      pathname.includes('/report')
    ))

  // Tester-only routes
  const isTesterRoute = pathname.startsWith('/tests')

  // Admin-only routes
  const isAdminRoute = pathname.startsWith('/admin')

  // complete-profile — any authenticated user
  const isCompleteProfile = pathname.startsWith('/complete-profile')

  if (isCompleteProfile) return response

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
  matcher: ['/((?!_next/static|_next/image).*)'],
}
