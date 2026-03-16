import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', data.user.id)
        .single()

      if (!existingUser) {
        return NextResponse.redirect(`${origin}/complete-profile`)
      }

      const role = existingUser.role
      if (role === 'admin') return NextResponse.redirect(`${origin}/admin`)
      if (role === 'developer') return NextResponse.redirect(`${origin}/dashboard`)
      return NextResponse.redirect(`${origin}/tests`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}