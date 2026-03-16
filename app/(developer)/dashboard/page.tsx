'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { MetricCard } from '@/components/analytics/MetricCard'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { Upload, TrendingUp, MessageSquare, DollarSign, Plus,
         Eye, FileText } from 'lucide-react'
import type { App } from '@/types/database'

export default function DeveloperDashboard() {
  const { user } = useAuth()
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/apps?mine=true')
      .then(r => r.json())
      .then(({ data }) => { setApps(data ?? []); setLoading(false) })
  }, [])

  const activeApps = apps.filter(a => a.status === 'active')

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-1">Developer Dashboard</h1>
              <p className="text-text-secondary">Welcome back! Here&apos;s your testing overview.</p>
            </div>
            <Link href="/submit"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors">
              <Plus className="w-4 h-4" />
              Submit New App
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard label="Apps Submitted" value={apps.length}
              icon={<Upload className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" />
            <MetricCard label="Avg. UX Score" value="—"
              icon={<TrendingUp className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
            <MetricCard label="Total Feedback" value="0"
              icon={<MessageSquare className="w-5 h-5 text-orange-500" />} iconBg="bg-orange-50" />
            <MetricCard label="Pending Payment" value="$0"
              icon={<DollarSign className="w-5 h-5 text-purple-600" />} iconBg="bg-purple-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-border">
                  <h2 className="text-lg font-semibold text-text-primary">My Apps</h2>
                </div>
                <div className="p-6 space-y-4">
                  {loading ? (
                    <p className="text-text-faint text-sm">Loading...</p>
                  ) : apps.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-text-faint text-sm mb-4">No apps submitted yet</p>
                      <Link href="/submit"
                        className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-lg text-sm font-medium">
                        <Plus className="w-4 h-4" /> Submit your first app
                      </Link>
                    </div>
                  ) : apps.map(app => (
                    <div key={app.id} className="bg-surface-muted rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-text-primary">{app.name}</h3>
                            <Badge variant={
                              app.status === 'active' ? 'success' :
                              app.status === 'pending' ? 'warning' : 'danger'
                            }>
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-text-faint">
                            Submitted {new Date(app.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/apps/${app.id}/analytics`}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-surface-border text-text-secondary text-sm hover:bg-white transition-colors">
                          <Eye className="w-4 h-4" /> Analytics
                        </Link>
                        {app.status === 'active' && (
                          <Link href={`/apps/${app.id}/report`}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-black text-white text-sm hover:bg-brand-dark transition-colors">
                            <FileText className="w-4 h-4" /> View Report
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/submit"
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-surface-border text-text-secondary text-sm hover:bg-surface-muted transition-colors">
                    <Plus className="w-4 h-4" /> Submit New App
                  </Link>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-surface-border text-text-secondary text-sm hover:bg-surface-muted transition-colors">
                    <DollarSign className="w-4 h-4" /> Payment Settings
                  </button>
                </div>
              </div>

              <div className="bg-brand-black rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold tracking-widest text-white/60 mb-2">UPGRADE YOUR LISTING</p>
                <h3 className="font-semibold mb-2">Get featured placement + creator review</h3>
                <p className="text-sm text-white/80 mb-4">
                  Builder $29 · Launch $97 founding price
                </p>
                <button className="w-full py-2.5 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                  Upgrade Now
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold text-text-primary mb-4">Recent Activity</h3>
                {apps.length === 0 ? (
                  <p className="text-sm text-text-faint">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {apps.slice(0, 3).map(app => (
                      <div key={app.id} className="flex gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-text-primary">{app.name} submitted for review</p>
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