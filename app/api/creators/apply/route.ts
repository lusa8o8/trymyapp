import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, content_url, niche, follower_range,
            country, why_join } = body

    if (!name || !email || !content_url || !niche ||
        !follower_range || !country || !why_join) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const serviceClient = createServiceClient()

    const { data: existing } = await serviceClient
      .from('creator_applications')
      .select('id, status')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      )
    }

    const { data, error } = await serviceClient
      .from('creator_applications')
      .insert({ name, email, content_url, niche,
                follower_range, country, why_join })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      message: 'Application submitted successfully'
    }, { status: 201 })
  } catch (err) {
    console.error('Creator apply error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

