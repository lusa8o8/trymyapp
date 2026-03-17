import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase-server'

function createRouteClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const mine = searchParams.get('mine')
    const serviceClient = createServiceClient()

    if (mine) {
      const supabase = createRouteClient(request)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { data, error } = await serviceClient
        .from('apps')
        .select('*, developer:users!developer_id(display_name, email)')
        .eq('developer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }

    let query = serviceClient
      .from('apps')
      .select('*, developer:users!developer_id(display_name, email)')
      .eq('status', 'active')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const tierOrder: Record<string, number> = {
      launch: 0,
      builder: 1,
      free: 2
    }

    const sorted = (data ?? []).sort((a, b) => {
      const tierDiff = (tierOrder[a.tier] ?? 2) - (tierOrder[b.tier] ?? 2)
      if (tierDiff !== 0) return tierDiff
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return NextResponse.json({ data: sorted })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
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

    if (!userData || userData.role !== 'developer') {
      return NextResponse.json({ error: 'Only developers can submit apps' }, { status: 403 })
    }

    const body = await request.json()
    const { name, url, description, instructions, category,
            stage, target_user, specific_feedback,
            screenshot_url, icon_url } = body

    if (!name || !url || !description || !instructions || !category || !stage || !target_user || !specific_feedback) {
      return NextResponse.json(
        { error: 'name, url, description, instructions, category, stage, target_user and specific_feedback are required' },
        { status: 400 }
      )
    }

    const serviceClient = createServiceClient()
    const { data, error } = await serviceClient
      .from('apps')
      .insert({
        developer_id: user.id,
        name, url, description, instructions, category,
        stage, target_user, specific_feedback,
        screenshot_url: screenshot_url ?? null,
        icon_url: icon_url ?? null,
        status: 'pending',
        tier: 'free'
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data, message: 'App submitted for review' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
