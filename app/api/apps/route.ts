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
          return request.cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: decodeURIComponent(cookie.value),
          }))
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
    const sort = searchParams.get('sort') ?? 'newest'
    const mine = searchParams.get('mine')

    const serviceClient = createServiceClient()

    if (mine) {
      const supabase = createRouteClient(request)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('GET /api/apps mine - user:', user?.id, 'error:', authError?.message)
      
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

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

    if (category && category !== 'all') query = query.eq('category', category)
    if (sort === 'featured') query = query.eq('tier', 'launch')
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const cookies = request.cookies.getAll(); console.log('POST cookies full:', JSON.stringify(cookies.map(c => ({name: c.name, len: c.value.length})))); console.log('POST /api/apps - user:', user?.id, 'error:', authError?.message)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
            screenshot_url, icon_url } = body

    if (!name || !url || !description || !instructions || !category) {
      return NextResponse.json(
        { error: 'name, url, description, instructions and category are required' },
        { status: 400 }
      )
    }

    const serviceClient = createServiceClient()
    const { data, error } = await serviceClient
      .from('apps')
      .insert({
        developer_id: user.id,
        name, url, description, instructions, category,
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


