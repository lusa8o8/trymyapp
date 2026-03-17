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

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || (userData.role !== 'tester' && userData.role !== 'developer')) {
      return NextResponse.json(
        { error: 'Only testers and developers can start tests' },
        { status: 403 }
      )
    }

    const { app_id } = await request.json()
    if (!app_id) return NextResponse.json({ error: 'app_id required' }, { status: 400 })

    const serviceClient = createServiceClient()

    const { data: app } = await serviceClient
      .from('apps')
      .select('id, status')
      .eq('id', app_id)
      .eq('status', 'active')
      .single()

    if (!app) return NextResponse.json({ error: 'App not found or not active' }, { status: 404 })

    const { data: existing } = await serviceClient
      .from('tests')
      .select('id, status')
      .eq('app_id', app_id)
      .eq('tester_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ data: existing, message: 'Test already started' })
    }

    const { data: test, error } = await serviceClient
      .from('tests')
      .insert({
        app_id,
        tester_id: user.id,
        status: 'started'
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await serviceClient.from('events').insert({
      event_type: 'test_started',
      user_id: user.id,
      app_id,
      metadata: { test_id: test.id }
    })

    return NextResponse.json({ data: test }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
