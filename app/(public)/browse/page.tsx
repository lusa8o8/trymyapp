'use client'

import { useEffect, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { AppCard } from '@/components/apps/AppCard'
import { Search } from 'lucide-react'
import type { App } from '@/types/database'

const CATEGORIES = ['All', 'SaaS', 'Tools', 'Productivity', 'Games',
  'Social', 'Education', 'Health & Fitness', 'Finance', 'Other']

type AppWithDeveloper = App & {
  developer: { display_name: string | null; email: string }
}

export default function BrowsePage() {
  const [apps, setApps] = useState<AppWithDeveloper[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    fetch(`/api/apps?${params}`)
      .then(r => r.json())
      .then(({ data }) => { setApps(data ?? []); setLoading(false) })
  }, [category])

  const filtered = apps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen">
        <div className="bg-white border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Browse Apps
            </h1>
            <p className="text-text-secondary mb-6">
              Discover MVPs looking for real feedback from testers like you
            </p>

            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
              <input
                type="text"
                placeholder="Search apps..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-border bg-white text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-2 flex-wrap mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-brand-black text-white'
                    : 'bg-white border border-surface-border text-text-secondary hover:border-brand-black hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-faint text-lg">No apps found</p>
              <p className="text-text-faint text-sm mt-1">
                Try a different search or category
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-text-faint mb-4">
                {filtered.length} app{filtered.length !== 1 ? 's' : ''} available
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(app => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
