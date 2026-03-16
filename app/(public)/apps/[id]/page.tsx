'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PageWrapper from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { ExternalLink, Clock, Tag, User } from 'lucide-react'
import type { App } from '@/types/database'

type AppWithDeveloper = App & {
  developer: { display_name: string | null; email: string }
}

export default function AppDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [app, setApp] = useState<AppWithDeveloper | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/apps/${id}`)
      .then(r => r.json())
      .then(({ data }) => { setApp(data); setLoading(false) })

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ event_type: 'app_viewed', app_id: id })
    })
  }, [id])

  const handleStartTest = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    setStarting(true)
    setError(null)

    const res = await fetch('/api/tests/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ app_id: id })
    })
    const result = await res.json()

    if (!res.ok) {
      setError(result.error)
      setStarting(false)
      return
    }

    router.push(`/tests/${result.data.id}`)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-surface-muted rounded-2xl" />
            <div className="h-8 bg-surface-muted rounded w-1/3" />
            <div className="h-4 bg-surface-muted rounded w-2/3" />
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!app) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-text-faint">App not found</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen">
        <div className="h-64 bg-gradient-to-br from-brand-black to-brand-dark relative">
          {app.screenshot_url && (
            <img
              src={app.screenshot_url}
              alt={app.name}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={app.tier === 'launch' ? 'black' : 'default'}>
                  {app.tier === 'launch' ? 'Featured' : 'Open Testing'}
                </Badge>
                <span className="text-white/60 text-sm">{app.category}</span>
              </div>
              <h1 className="text-4xl font-bold text-white">{app.name}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-semibold text-text-primary mb-3">
                  About this app
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-semibold text-text-primary mb-3">
                  Testing Instructions
                </h2>
                <div className="bg-surface-muted rounded-xl p-4">
                  <pre className="text-sm text-text-secondary whitespace-pre-wrap font-mono">
                    {app.instructions}
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold text-text-primary mb-1">
                  Test this app
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Give feedback and help this developer improve their product.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleStartTest}
                  disabled={starting}
                  className="w-full bg-brand-black text-white py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                  {starting ? 'Starting...' : user ? 'Start Testing' : 'Sign in to Test'}
                </button>

                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-lg border border-surface-border text-text-secondary text-sm hover:bg-surface-muted transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit App
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-card space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="w-4 h-4 text-text-faint" />
                  <span className="text-text-secondary">{app.category}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-text-faint" />
                  <span className="text-text-secondary">
                    {app.developer?.display_name || app.developer?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-text-faint" />
                  <span className="text-text-secondary">
                    {new Date(app.created_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
