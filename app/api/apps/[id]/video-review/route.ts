import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const serviceClient = createServiceClient()

    const { data } = await serviceClient
      .from('tests')
      .select('video_url, tester_id')
      .eq('app_id', id)
      .eq('status', 'completed')
      .not('video_url', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({ data: data ?? null })
  } catch {
    return NextResponse.json({ data: null })
  }
}
