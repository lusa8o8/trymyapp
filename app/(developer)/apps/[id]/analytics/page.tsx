'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageWrapper from '@/components/layout/PageWrapper'
import { MetricCard } from '@/components/analytics/MetricCard'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { Eye, Users, CheckCircle, Star,
         Clock, Bug, TrendingUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Analytics {
  app_id: string
  app_name: string
  total_views: number
  tests_started: number
  tests_completed: number
  feedback_count: number
  completion_rate: number
  avg_ux_score: number | null
  avg_session_duration_secs: number | null
  would_use_pct: number | null
  bugs_reported: number
  daily_activity: Array<{ date: string; tests: number; feedback: number }>
}

function formatDuration(secs: number | null): string {
  if (!secs) return '—'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function AppAnalyticsPage() {
  const params = useParams()
  const id = params.id as string
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/apps/${id}/analytics`, { credentials: 'include' })
      .then(r => r.json())
      .then(({ data, error }) => {
        if (error) setError(error)
        else setAnalytics(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-muted rounded w-1/4" />
            <div className="grid grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-surface-muted rounded-2xl" />
              ))}
            </div>
            <div className="h-64 bg-surface-muted rounded-2xl" />
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (error || !analytics) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-text-faint">{error ?? 'Analytics not found'}</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              {analytics.app_name}
            </h1>
            <p className="text-text-secondary">Analytics Overview</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="App Views"
              value={analytics.total_views}
              icon={<Eye className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-50"
            />
            <MetricCard
              label="Tests Started"
              value={analytics.tests_started}
              icon={<Users className="w-5 h-5 text-purple-600" />}
              iconBg="bg-purple-50"
            />
            <MetricCard
              label="Completion Rate"
              value={`${analytics.completion_rate}%`}
              icon={<CheckCircle className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-50"
            />
            <MetricCard
              label="Avg UX Score"
              value={analytics.avg_ux_score ?? '—'}
              icon={<Star className="w-5 h-5 text-amber-500" />}
              iconBg="bg-amber-50"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Feedback Received"
              value={analytics.feedback_count}
              icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
              iconBg="bg-orange-50"
            />
            <MetricCard
              label="Avg Session"
              value={formatDuration(analytics.avg_session_duration_secs)}
              icon={<Clock className="w-5 h-5 text-indigo-500" />}
              iconBg="bg-indigo-50"
            />
            <MetricCard
              label="Would Use"
              value={analytics.would_use_pct !== null ? `${analytics.would_use_pct}%` : '—'}
              icon={<CheckCircle className="w-5 h-5 text-teal-500" />}
              iconBg="bg-teal-50"
            />
            <MetricCard
              label="Bugs Reported"
              value={analytics.bugs_reported}
              icon={<Bug className="w-5 h-5 text-red-500" />}
              iconBg="bg-red-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Daily Test Activity
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.daily_activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="tests" name="Tests Started"
                    fill="#0F172A" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Feedback Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.daily_activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="feedback"
                    name="Feedback"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
