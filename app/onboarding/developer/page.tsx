'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function DeveloperOnboardingPage() {
  return (
    <div className="bg-surface-muted min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-surface-border shadow-card p-12 text-center">
        <div className="w-20 h-20 bg-brand-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          You&apos;re in. Let&apos;s get your app tested.
        </h1>
        <p className="text-xl text-text-secondary mb-12 max-w-xl mx-auto">
          Submit your app in 2 minutes. Your first feedback could
          arrive within 48 hours.
        </p>
        <div className="bg-surface-muted rounded-xl p-8 mb-10 text-left max-w-md mx-auto">
          <div className="space-y-4">
            {[
              'Submit your app',
              'Choose your tier',
              'Wait for testers'
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-surface-border rounded flex-shrink-0" />
                <span className="text-text-secondary text-lg">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center justify-center bg-brand-black text-white text-lg px-10 py-4 rounded-lg hover:bg-brand-dark transition-colors font-medium mb-4"
        >
          Submit Your First App →
        </Link>
        <div className="mt-4">
          <Link href="/dashboard"
            className="text-text-faint hover:text-text-primary text-sm transition-colors">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
