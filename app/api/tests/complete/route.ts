import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase-server'

function createRouteClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteClient(request)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { test_id } = await request.json()
    if (!test_id) return NextResponse.json({ error: 'test_id required' }, { status: 400 })

    const serviceClient = createServiceClient()

    const { data: test } = await serviceClient
      .from('tests')
      .select('id, app_id, tester_id, status')
      .eq('id', test_id)
      .eq('tester_id', user.id)
      .single()

    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    if (test.status === 'completed') {
      return NextResponse.json({ data: test, message: 'Already completed' })
    }

    const { data: updated, error } = await serviceClient
      .from('tests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', test_id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await serviceClient.from('events').insert({
      event_type: 'test_completed',
      user_id: user.id,
      app_id: test.app_id,
      metadata: { test_id }
    })

    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
