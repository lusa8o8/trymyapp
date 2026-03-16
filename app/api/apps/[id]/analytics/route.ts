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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createRouteClient(request)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const serviceClient = createServiceClient()

    const { data: app } = await serviceClient
      .from('apps')
      .select('id, name, developer_id')
      .eq('id', id)
      .single()

    if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 })

    const { data: userData } = await serviceClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (app.developer_id !== user.id && userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: tests } = await serviceClient
      .from('tests')
      .select('id, status, started_at, completed_at')
      .eq('app_id', id)

    const totalTests = tests?.length ?? 0
    const completedTests = tests?.filter(t => t.status === 'completed').length ?? 0
    const completionRate = totalTests > 0
      ? Math.round((completedTests / totalTests) * 100)
      : 0

    const testIds = tests?.map(t => t.id) ?? []
    
    let feedbacks: Array<{
      ux_rating: number | null
      would_use: boolean | null
      bug_report: string | null
      suggestions: string | null
      ux_feedback: string | null
    }> = []

    if (testIds.length > 0) {
      const { data: fb } = await serviceClient
        .from('feedback')
        .select('ux_rating, would_use, bug_report, suggestions, ux_feedback')
        .in('test_id', testIds)
      feedbacks = fb ?? []
    }

    const feedbackCount = feedbacks.length
    const avgUxScore = feedbackCount > 0
      ? Math.round(
          (feedbacks.reduce((sum, f) => sum + (f.ux_rating ?? 0), 0) / feedbackCount)
          * 10
        ) / 10
      : null

    const wouldUseCount = feedbacks.filter(f => f.would_use === true).length ?? 0
    const wouldUsePct = feedbackCount > 0
      ? Math.round((wouldUseCount / feedbackCount) * 100)
      : null

    const bugsReported = feedbacks.filter(
      f => f.bug_report && f.bug_report.trim().length > 0
    ).length ?? 0

    const completedWithTimes = tests?.filter(
      t => t.status === 'completed' && t.started_at && t.completed_at
    ) ?? []

    const avgDurationSecs = completedWithTimes.length > 0
      ? Math.round(
          completedWithTimes.reduce((sum, t) => {
            const duration =
              (new Date(t.completed_at!).getTime() -
               new Date(t.started_at).getTime()) / 1000
            return sum + duration
          }, 0) / completedWithTimes.length
        )
      : null

    const { data: events } = await serviceClient
      .from('events')
      .select('event_type, timestamp')
      .eq('app_id', id)
      .order('timestamp', { ascending: true })

    const appViews = events?.filter(e => e.event_type === 'app_viewed').length ?? 0

    const now = new Date()
    const dailyActivity = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (13 - i))
      const dateStr = date.toISOString().split('T')[0]

      const dayTests = tests?.filter(t =>
        t.started_at && t.started_at.startsWith(dateStr)
      ).length ?? 0

      const dayFeedback = tests?.filter(t =>
        t.started_at && t.started_at.startsWith(dateStr) && t.status === 'completed'
      ).length ?? 0

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tests: dayTests,
        feedback: dayFeedback
      }
    })

    return NextResponse.json({
      data: {
        app_id: id,
        app_name: app.name,
        total_views: appViews,
        tests_started: totalTests,
        tests_completed: completedTests,
        feedback_count: feedbackCount,
        completion_rate: completionRate,
        avg_ux_score: avgUxScore,
        avg_session_duration_secs: avgDurationSecs,
        would_use_pct: wouldUsePct,
        bugs_reported: bugsReported,
        daily_activity: dailyActivity
      }
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
