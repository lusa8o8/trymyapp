import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') ?? 'newest'
    const mine = searchParams.get('mine')

    const supabase = createServiceClient()

    let query = supabase
      .from('apps')
      .select('*, developer:users!developer_id(display_name, email)')

    if (mine) {
      console.log('GET /api/apps?mine=true - checking auth')
      const authClient = await createClient()
      const { data: { user }, error: authError } = await authClient.auth.getUser()
      
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      query = query.eq('developer_id', user.id)
    } else {
      query = query.eq('status', 'active')
    }

    if (category && category !== 'all') query = query.eq('category', category)
    if (sort === 'newest') query = query.order('created_at', { ascending: false })
    else if (sort === 'featured') query = query.eq('tier', 'launch').order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/apps - checking auth')
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (!userData || userData.role !== 'developer') {
      return NextResponse.json({ error: 'Only developers can submit apps' }, { status: 403 })
    }

    const body = await request.json()
    const { name, url, description, instructions, category, screenshot_url, icon_url } = body

    if (!name || !url || !description || !instructions || !category) {
      return NextResponse.json({ error: 'name, url, description, instructions and category are required' }, { status: 400 })
    }

    const serviceClient = createServiceClient()
    const { data, error } = await serviceClient
      .from('apps')
      .insert({ developer_id: user.id, name, url, description, instructions, category,
                screenshot_url: screenshot_url ?? null, icon_url: icon_url ?? null,
                status: 'pending', tier: 'free' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data, message: 'App submitted for review' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}