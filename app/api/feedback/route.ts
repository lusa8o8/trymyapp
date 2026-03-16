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

    const body = await request.json()
    const { test_id, ux_rating, ux_feedback, bug_report,
            suggestions, checklist_done, would_use } = body

    if (!test_id) return NextResponse.json({ error: 'test_id required' }, { status: 400 })

    const serviceClient = createServiceClient()

    const { data: test } = await serviceClient
      .from('tests')
      .select('id, app_id, tester_id')
      .eq('id', test_id)
      .eq('tester_id', user.id)
      .single()

    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 })

    const { data: existing } = await serviceClient
      .from('feedback')
      .select('id')
      .eq('test_id', test_id)
      .single()

    if (existing) {
      const { data, error } = await serviceClient
        .from('feedback')
        .update({ ux_rating, ux_feedback, bug_report,
                  suggestions, checklist_done, would_use })
        .eq('test_id', test_id)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }

    const { data, error } = await serviceClient
      .from('feedback')
      .insert({ test_id, ux_rating, ux_feedback, bug_report,
                suggestions, checklist_done: checklist_done ?? false,
                would_use })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await serviceClient.from('events').insert({
      event_type: 'feedback_submitted',
      user_id: user.id,
      app_id: test.app_id,
      metadata: { test_id, ux_rating }
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
