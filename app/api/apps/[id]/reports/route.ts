import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase-server'
import { generateReport, FeedbackData } from '@/lib/claude'

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
      .select('id, name, description, category, stage, target_user, specific_feedback, developer_id')
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

    const { data: report } = await serviceClient
      .from('reports')
      .select('*')
      .eq('app_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({ data: report ?? null })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
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
      .select('id, name, description, category, stage, target_user, specific_feedback, developer_id')
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
      .select('id, status')
      .eq('app_id', id)
      .eq('status', 'completed')

    const testIds = tests?.map(t => t.id) ?? []

    if (testIds.length === 0) {
      return NextResponse.json(
        { error: 'No completed tests available to generate report' },
        { status: 400 }
      )
    }

    const { data: feedbacks } = await serviceClient
      .from('feedback')
      .select('ux_rating, ux_feedback, bug_report, suggestions, would_use, checklist_done')
      .in('test_id', testIds)

    const feedbackData: FeedbackData = {
      app_name: app.name,
      app_description: app.description ?? '',
      app_category: app.category,
      app_stage: app.stage ?? null,
      target_user: app.target_user ?? null,
      specific_feedback_requested: app.specific_feedback ?? null,
      total_testers: testIds.length,
      completed_tests: testIds.length,
      feedbacks: (feedbacks ?? []).map(f => ({
        ux_rating: f.ux_rating,
        ux_feedback: f.ux_feedback,
        bug_report: f.bug_report,
        suggestions: f.suggestions,
        would_use: f.would_use,
        checklist_done: f.checklist_done ?? false
      }))
    }

    const reportContent = await generateReport(feedbackData)

    const { data: report, error: insertError } = await serviceClient
      .from('reports')
      .insert({
        app_id: id,
        summary: reportContent.summary,
        ux_score_avg: reportContent.ux_score_avg,
        sentiment: reportContent.sentiment,
        top_issues: reportContent.top_issues as unknown as string,
        bugs: reportContent.bugs as unknown as string,
        suggestions: reportContent.suggestions as unknown as string,
        would_use_pct: reportContent.would_use_pct,
        priority_actions: reportContent.priority_actions as unknown as string,
        detailed_analysis: reportContent.detailed_analysis,
        created_by: user.id
      })
      .select()
      .single()

    if (insertError) {
      console.error('Report insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 })
    }

    return NextResponse.json({ data: report })
  } catch (err) {
    console.error('Report generation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
