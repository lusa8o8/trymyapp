'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import type { App } from '@/types/database'

interface AppCardProps {
  app: App & { developer?: { display_name: string | null; email: string } }
  showCTA?: boolean
}

export function AppCard({ app, showCTA = true }: AppCardProps) {
  const isFeatured = app.tier === 'launch'

  return (
    <Link href={`/apps/${app.id}`}>
      <div className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-hover cursor-pointer ${
        isFeatured ? 'border-brand-black shadow-card' : 'border-surface-border shadow-card'
      }`}>
        <div className="h-44 bg-gradient-to-br from-brand-black to-brand-dark relative overflow-hidden">
          {app.screenshot_url ? (
            <img
              src={app.screenshot_url}
              alt={app.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-bold text-white/20">
                {app.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            {app.tier === 'launch' && (
              <span className="bg-brand-black text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
            {app.tier === 'builder' && (
              <span className="bg-white text-brand-black text-xs font-medium px-2.5 py-1 rounded-full border border-surface-border">
                Featured
              </span>
            )}
            {app.tier === 'free' && (
              <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Testing Open
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-brand-black bg-surface-muted px-2 py-0.5 rounded-full">
              {app.category}
            </span>
          </div>
          <h3 className="font-semibold text-text-primary text-base mb-1 truncate">
            {app.name}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {app.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-text-faint">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              0 testers
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}