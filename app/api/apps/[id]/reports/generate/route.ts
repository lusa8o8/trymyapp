import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase-server'
import { generateReport } from '@/lib/claude'

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

    if (!tests || tests.length === 0) {
      return NextResponse.json(
        { error: 'No tests found. At least one tester must complete testing before generating a report.' },
        { status: 400 }
      )
    }

    const completedTestIds = tests
      .filter(t => t.status === 'completed')
      .map(t => t.id)

    if (completedTestIds.length === 0) {
      return NextResponse.json(
        { error: 'No completed tests found. Wait for testers to complete testing.' },
        { status: 400 }
      )
    }

    const { data: feedbacks } = await serviceClient
      .from('feedback')
      .select('ux_rating, ux_feedback, bug_report, suggestions, would_use, checklist_done')
      .in('test_id', completedTestIds)

    const { data: existingReport } = await serviceClient
      .from('reports')
      .select('id')
      .eq('app_id', id)
      .maybeSingle()

    let reportId: string

    if (existingReport) {
      await serviceClient
        .from('reports')
        .update({ status: 'generating' })
        .eq('id', existingReport.id)
      reportId = existingReport.id
    } else {
      const { data: newReport } = await serviceClient
        .from('reports')
        .insert({
          app_id: id,
          status: 'generating',
          feedback_count: feedbacks?.length ?? 0
        })
        .select('id')
        .single()
      reportId = newReport!.id
    }

    const reportContent = await generateReport({
      app_name: app.name,
      app_description: app.description,
      app_category: app.category,
      app_stage: app.stage ?? null,
      target_user: app.target_user ?? null,
      specific_feedback_requested: app.specific_feedback ?? null,
      total_testers: tests.length,
      completed_tests: completedTestIds.length,
      feedbacks: feedbacks ?? []
    })

    await serviceClient
      .from('reports')
      .update({
        status: 'ready',
        content_json: reportContent,
        generated_at: new Date().toISOString(),
        feedback_count: feedbacks?.length ?? 0
      })
      .eq('id', reportId)

    return NextResponse.json({
      data: { report_id: reportId, ...reportContent },
      message: 'Report generated successfully'
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
