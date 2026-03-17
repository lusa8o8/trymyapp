'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageWrapper from '@/components/layout/PageWrapper'
import { AppCard } from '@/components/apps/AppCard'
import { CheckCircle } from 'lucide-react'
import type { App } from '@/types/database'

type AppWithDeveloper = App & {
  developer: { display_name: string | null; email: string }
}

function CompletedBanner() {
  const searchParams = useSearchParams()
  const completed = searchParams.get('completed')

  if (!completed) return null

  return (
    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6">
      <CheckCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">
        Test completed! Your feedback has been submitted successfully.
      </p>
    </div>
  )
}

export default function TestsPage() {
  const [apps, setApps] = useState<AppWithDeveloper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/apps')
      .then(r => r.json())
      .then(({ data }) => { setApps(data ?? []); setLoading(false) })
  }, [])

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen">
        <div className="bg-white border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Available Tests
            </h1>
            <p className="text-text-secondary">
              Test apps as a peer reviewer and help fellow builders improve their products
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={null}>
            <CompletedBanner />
          </Suspense>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-faint text-lg">No apps available for testing</p>
              <p className="text-text-faint text-sm mt-1">Check back soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
