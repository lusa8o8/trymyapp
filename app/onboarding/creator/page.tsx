'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function CreatorOnboardingPage() {
  return (
    <div className="bg-surface-muted min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-surface-border shadow-card p-12 text-center">
        <div className="w-20 h-20 bg-brand-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Sparkles className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Welcome to the network.
        </h1>
        <p className="text-xl text-text-secondary mb-12 max-w-xl mx-auto">
          You&apos;ve been selected as a TryMyApp creator-tester.
          Here&apos;s how to get started.
        </p>
        <div className="bg-surface-muted rounded-xl p-8 mb-10 text-left max-w-md mx-auto">
          <div className="space-y-4">
            {[
              'Browse available apps in your niche',
              'Claim a test and follow the 6-step flow',
              'Publish your video review and submit the URL',
              'Get paid $50 within 48 hours'
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-surface-border rounded flex-shrink-0" />
                <span className="text-text-secondary">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/tests"
          className="inline-flex items-center justify-center bg-brand-black text-white text-lg px-10 py-4 rounded-lg hover:bg-brand-dark transition-colors font-medium"
        >
          Browse Available Tests →
        </Link>
      </div>
    </div>
  )
}
