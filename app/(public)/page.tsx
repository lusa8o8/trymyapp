'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { ArrowRight, Upload, Users, Video, Check } from 'lucide-react'

interface Stats {
  apps_tested: number
  creator_testers: number
  reports_generated: number
  founding_slots_used: number
  founding_slots_remaining: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    apps_tested: 0,
    creator_testers: 0,
    reports_generated: 0,
    founding_slots_used: 0,
    founding_slots_remaining: 50
  })

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(({ data }) => { if (data) setStats(data) })
  }, [])

  return (
    <PageWrapper>
      <div className="bg-white">

        <section className="bg-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold text-text-primary mb-6 leading-tight">
                Your next build deserves a real audience.
              </h1>
              <p className="text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
                Submit your MVP — finished or not. Get structured feedback
                from fellow builders and a YouTube review from a creator
                in your niche.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center bg-brand-black text-white text-lg px-10 py-4 rounded-lg hover:bg-brand-dark transition-colors font-medium"
                >
                  Submit Your App
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center border-2 border-brand-black text-brand-black text-lg px-10 py-4 rounded-lg hover:bg-surface-muted transition-colors font-medium"
                >
                  Browse Apps
                </Link>
              </div>
              <Link
                href="/creators"
                className="text-sm text-text-faint hover:text-text-primary inline-flex items-center gap-1 transition-colors"
              >
                Are you a creator? Join the network
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-brand-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">
                  {stats.apps_tested}
                </div>
                <div className="text-white/70">Apps Tested</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">
                  {stats.creator_testers}
                </div>
                <div className="text-white/70">Creator Testers</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">
                  {stats.reports_generated}
                </div>
                <div className="text-white/70">AI Reports Generated</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">
                  {stats.founding_slots_remaining}/{50}
                </div>
                <div className="text-white/70">Launch Slots Remaining</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                From submission to insight in 3 steps
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Upload className="w-8 h-8" />,
                  title: 'Submit your app',
                  desc: 'Quick 2-minute form with app details and what you need feedback on'
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: 'A creator tests it',
                  desc: 'Curated creator-tester explores your app with fresh eyes'
                },
                {
                  icon: <Video className="w-8 h-8" />,
                  title: 'Get your report + video review',
                  desc: 'AI report with insights plus video review published on their channel'
                },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-brand-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-lg">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                Simple, honest pricing
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

              <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-card hover:shadow-hover transition-all">
                <h3 className="text-2xl font-bold text-text-primary mb-2">FREE</h3>
                <div className="text-4xl font-bold text-text-primary mb-4">$0</div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Listed in browse feed',
                    'Peer review from community',
                    'Basic feedback',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-secondary">
                      <Check className="w-5 h-5 text-text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 rounded-lg border-2 border-brand-black text-brand-black font-medium hover:bg-surface-muted transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-brand-black shadow-hover transition-all md:-translate-y-2">
                <h3 className="text-2xl font-bold text-text-primary mb-2">BUILDER</h3>
                <div className="text-4xl font-bold text-text-primary mb-1">$29</div>
                <div className="text-sm text-text-faint mb-4">one-time</div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Featured placement',
                    'AI-generated report',
                    'Analytics dashboard',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-secondary">
                      <Check className="w-5 h-5 text-text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 rounded-lg bg-brand-black text-white font-medium hover:bg-brand-dark transition-colors"
                >
                  Get Builder
                </Link>
              </div>

              <div className="bg-brand-black rounded-2xl p-8 border border-brand-black shadow-card hover:shadow-hover transition-all relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-brand-black px-4 py-1 rounded-full text-xs font-bold">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">LAUNCH</h3>
                <div className="text-4xl font-bold text-white mb-1">$97</div>
                <div className="text-sm text-white/70 mb-4">founding price</div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in Builder',
                    'Guaranteed YouTube review',
                    'Creator assigned within 14 days',
                    'Video on your app page forever',
                    'Refund if not assigned in 14 days',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90">
                      <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 rounded-lg bg-white text-brand-black font-bold hover:bg-white/90 transition-colors mb-3"
                >
                  Get Launch
                </Link>
                <div className="text-center text-xs text-white/60">
                  Founding price — 50 slots only
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-surface-muted border-t border-surface-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Are you a creator?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Join a curated network of creator-testers. Get early access
              to products in your niche and earn for every review you publish.
            </p>
            <Link
              href="/creators"
              className="inline-flex items-center justify-center bg-brand-black text-white text-lg px-10 py-4 rounded-lg hover:bg-brand-dark transition-colors font-medium"
            >
              Apply to Join
            </Link>
          </div>
        </section>

      </div>
    </PageWrapper>
  )
}
