'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import PageWrapper from '@/components/layout/PageWrapper'
import { MetricCard } from '@/components/analytics/MetricCard'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { Upload, TrendingUp, MessageSquare, DollarSign, Plus,
         Eye, FileText, CheckCircle } from 'lucide-react'
import type { App } from '@/types/database'

interface DashboardMetrics {
  totalApps: number
  avgUxScore: number | null
  totalFeedback: number
}

function PostSubmitUpgradePrompt() {
  const searchParams = useSearchParams()
  const submitted = searchParams.get('submitted')

  if (!submitted) return null

  return (
    <div className="bg-white border-2 border-brand-black rounded-2xl p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-text-primary text-lg mb-1">
            Your app is in review. Want to fast-track it?
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            Upgrade to Launch tier to get featured placement and
            a guaranteed YouTube review from a creator in your niche.
            First 50 slots at founding price.
          </p>
          <div className="flex gap-3">
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              View pricing
            </a>
            <a
              href="?dismissed=true"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm text-text-faint hover:text-text-primary transition-colors"
            >
              Maybe later
            </a>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-bold text-text-primary">$97</div>
          <div className="text-xs text-text-faint">founding price</div>
        </div>
      </div>
    </div>
  )
}

function PaymentBanner() {
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('payment')
  const paymentTier = searchParams.get('tier')

  if (paymentStatus === 'success') {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">
          Payment successful! Your app has been upgraded to{' '}
          {paymentTier === 'launch' ? 'Launch tier' : 'Builder tier'}.
        </p>
      </div>
    )
  }

  if (paymentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6">
        <p className="text-sm">Payment cancelled. No charge was made.</p>
      </div>
    )
  }

  return null
}

export default function DeveloperDashboard() {
  const { user } = useAuth()
  const [apps, setApps] = useState<App[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalApps: 0,
    avgUxScore: null,
    totalFeedback: 0
  })
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    fetch('/api/apps?mine=true', { credentials: 'include' })
      .then(r => r.json())
      .then(async ({ data }) => {
        const myApps: App[] = data ?? []
        setApps(myApps)

        const activeApps = myApps.filter(a => a.status === 'active')
        if (activeApps.length === 0) {
          setMetrics({ totalApps: myApps.length, avgUxScore: null, totalFeedback: 0 })
          setLoading(false)
          return
        }

        const analyticsResults = await Promise.all(
          activeApps.map(app =>
            fetch(`/api/apps/${app.id}/analytics`, { credentials: 'include' })
              .then(r => r.json())
              .then(({ data }) => data)
              .catch(() => null)
          )
        )

        const validResults = analyticsResults.filter(Boolean)
        const totalFeedback = validResults.reduce(
          (sum, a) => sum + (a?.feedback_count ?? 0), 0
        )
        const scoresWithData = validResults.filter(
          a => a?.avg_ux_score !== null
        )
        const avgUxScore = scoresWithData.length > 0
          ? Math.round(
              scoresWithData.reduce(
                (sum, a) => sum + a.avg_ux_score, 0
              ) / scoresWithData.length * 10
            ) / 10
          : null

        setMetrics({
          totalApps: myApps.length,
          avgUxScore,
          totalFeedback
        })
        setLoading(false)
      })
  }, [])

  const handleUpgrade = async (tier: 'builder' | 'launch') => {
    if (!apps.length) {
      alert('Submit an app first before upgrading')
      return
    }
    const activeApp = apps.find(a => a.status === 'active') ?? apps[0]
    setUpgrading(true)

    const res = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ app_id: activeApp.id, tier })
    })
    const result = await res.json()

    if (!res.ok) {
      alert(result.error)
      setUpgrading(false)
      return
    }

    window.location.href = result.url
  }

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-1">
                Developer Dashboard
              </h1>
              <p className="text-text-secondary">
                Welcome back! Here&apos;s your testing overview.
              </p>
            </div>
            <Link
              href="/submit"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Submit New App
            </Link>
          </div>

          <Suspense fallback={null}>
            <PaymentBanner />
          </Suspense>
          <Suspense fallback={null}>
            <PostSubmitUpgradePrompt />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Apps Submitted"
              value={metrics.totalApps}
              icon={<Upload className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-50"
            />
            <MetricCard
              label="Avg. UX Score"
              value={metrics.avgUxScore !== null ? `${metrics.avgUxScore}/5` : '—'}
              icon={<TrendingUp className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-50"
            />
            <MetricCard
              label="Total Feedback"
              value={metrics.totalFeedback}
              icon={<MessageSquare className="w-5 h-5 text-orange-500" />}
              iconBg="bg-orange-50"
            />
            <MetricCard
              label="Pending Payment"
              value="$0"
              icon={<DollarSign className="w-5 h-5 text-purple-600" />}
              iconBg="bg-purple-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-border">
                  <h2 className="text-lg font-semibold text-text-primary">
                    My Apps
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[1,2].map(i => (
                        <div key={i} className="h-24 bg-surface-muted rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : apps.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-text-faint text-sm mb-4">
                        No apps submitted yet
                      </p>
                      <Link
                        href="/submit"
                        className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-lg text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Submit your first app
                      </Link>
                    </div>
                  ) : (
                    apps.map(app => (
                      <div key={app.id} className="bg-surface-muted rounded-xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-text-primary">
                                {app.name}
                              </h3>
                              <Badge variant={
                                app.status === 'active' ? 'success' :
                                app.status === 'pending' ? 'warning' : 'danger'
                              }>
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-text-faint">
                              Submitted {new Date(app.created_at).toLocaleDateString(
                                'en-US', { month: 'long', day: 'numeric', year: 'numeric' }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link
                            href={`/apps/${app.id}/analytics`}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-surface-border text-text-secondary text-sm hover:bg-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Analytics
                          </Link>
                          {app.status === 'active' && (
                            <Link
                              href={`/apps/${app.id}/report`}
                              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-black text-white text-sm hover:bg-brand-dark transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              View Report
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/submit"
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-surface-border text-text-secondary text-sm hover:bg-surface-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Submit New App
                  </Link>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-surface-border text-text-secondary text-sm hover:bg-surface-muted transition-colors">
                    <DollarSign className="w-4 h-4" />
                    Payment Settings
                  </button>
                </div>
              </div>

              {!apps.some(a => a.tier === 'launch') && (
              <div className="bg-brand-black rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold tracking-widest text-white/60 mb-2">
                  UPGRADE YOUR LISTING
                </p>
                <h3 className="font-semibold mb-2">
                  Get featured placement + creator review
                </h3>
                <p className="text-sm text-white/80 mb-4">
                  Builder $29 · Launch $97 founding price
                </p>
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => handleUpgrade('builder')}
                    disabled={upgrading}
                    className="w-full py-2 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Builder — $29
                  </button>
                  <button
                    onClick={() => handleUpgrade('launch')}
                    disabled={upgrading}
                    className="w-full py-2.5 rounded-lg bg-white text-brand-black text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {upgrading ? 'Redirecting...' : 'Launch — $97 founding'}
                  </button>
                </div>
              </div>
              )}

              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Recent Activity
                </h3>
                {apps.length === 0 ? (
                  <p className="text-sm text-text-faint">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {apps.slice(0, 3).map(app => (
                      <div key={app.id} className="flex gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-text-primary">
                            {app.name} — {app.status}
                          </p>
                          <p className="text-xs text-text-faint">
                            {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
