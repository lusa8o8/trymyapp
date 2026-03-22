import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const serviceClient = createServiceClient()

    const [testsResult, usersResult, reportsResult, foundingResult] = await Promise.all([
      serviceClient
        .from('tests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),
      serviceClient
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'tester'),
      serviceClient
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ready'),
      serviceClient
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'launch_tier')
        .eq('status', 'completed'),
    ])

    return NextResponse.json({
      data: {
        apps_tested: testsResult.count ?? 0,
        creator_testers: usersResult.count ?? 0,
        reports_generated: reportsResult.count ?? 0,
        founding_slots_used: foundingResult.count ?? 0,
        founding_slots_remaining: Math.max(0, 50 - (foundingResult.count ?? 0)),
      }
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
