'use client'

import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { TestTube, Video, DollarSign, Check } from 'lucide-react'

const NICHES = ['Tech', 'Finance', 'Lifestyle', 'Education',
  'Gaming', 'Health', 'Other']
const FOLLOWER_RANGES = ['Under 1k', '1k-5k', '5k-25k',
  '25k-100k', '100k+']

export default function CreatorsPage() {
  const [form, setForm] = useState({
    name: '', email: '', content_url: '', niche: '',
    follower_range: '', country: '', why_join: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value
      if (field === 'why_join') setCharCount(value.length)
      setForm(prev => ({ ...prev, [field]: value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/creators/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const result = await res.json()

    if (!res.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent text-sm mt-1"
  const labelClass = "block text-sm font-medium text-text-primary"

  return (
    <PageWrapper>
      <div className="bg-white">

        <section className="bg-white py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-6xl font-bold text-text-primary mb-6 leading-tight">
              Shape products before they launch
            </h1>
            <p className="text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
              TryMyApp.uk is building a curated network of creator-testers
              across every niche. Get early access to MVPs, earn $50 per
              video review, and grow alongside the products you help build.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center justify-center bg-brand-black text-white text-lg px-10 py-4 rounded-lg hover:bg-brand-dark transition-colors font-medium"
            >
              Apply to Join
            </a>
          </div>
        </section>

        <section className="py-24 bg-surface-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                What you do
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <TestTube className="w-8 h-8" />,
                  title: 'Test the app',
                  desc: 'Follow structured 6-step testing flow'
                },
                {
                  icon: <Video className="w-8 h-8" />,
                  title: 'Share your honest review',
                  desc: 'Publish a video on your channel'
                },
                {
                  icon: <DollarSign className="w-8 h-8" />,
                  title: 'Get paid + get credit',
                  desc: '$50 payout + permanent feature on app page'
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-brand-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-lg">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Who we&apos;re looking for
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              We&apos;re looking for creators who are genuinely curious about
              products. You don&apos;t need a million followers. You need a real
              audience, a real niche, and a real opinion.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {['Tech', 'Finance', 'Lifestyle', 'Education'].map(niche => (
                <span key={niche}
                  className="bg-brand-black text-white px-4 py-2 rounded-full text-base font-medium">
                  {niche}
                </span>
              ))}
              <span className="bg-surface-muted text-text-primary px-4 py-2 rounded-full text-base font-medium border border-surface-border">
                and more
              </span>
            </div>
            <p className="text-lg text-text-faint">
              Follower range: 1,000 — 100,000 subscribers
            </p>
          </div>
        </section>

        <section className="py-24 bg-surface-muted">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                The economics
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: '$50 per completed video review',
                  desc: 'Clear, straightforward payment for your work'
                },
                {
                  title: 'Paid within 48 hours of video verification',
                  desc: 'Fast, reliable payouts'
                },
                {
                  title: 'No exclusivity',
                  desc: 'Review products alongside your normal content'
                },
                {
                  title: 'Early access to products',
                  desc: 'In your niche before public launch'
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-surface-border shadow-card">
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="apply" className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-surface-border shadow-card p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">
                  Apply to join the network
                </h2>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Application submitted!
                  </h3>
                  <p className="text-text-secondary">
                    We&apos;ll review it within 48 hours and be in touch either way.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" value={form.name} onChange={set('name')}
                      placeholder="Your full name" required className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={form.email} onChange={set('email')}
                      placeholder="you@example.com" required className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Content URL (YouTube/TikTok/Instagram/Blog) *
                    </label>
                    <input type="url" value={form.content_url}
                      onChange={set('content_url')}
                      placeholder="https://youtube.com/@yourchannel"
                      required className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Niche *</label>
                    <select value={form.niche} onChange={set('niche')}
                      required className={inputClass}>
                      <option value="">Select your niche</option>
                      {NICHES.map(n => (
                        <option key={n} value={n.toLowerCase()}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Follower/Subscriber range *
                    </label>
                    <select value={form.follower_range}
                      onChange={set('follower_range')}
                      required className={inputClass}>
                      <option value="">Select range</option>
                      {FOLLOWER_RANGES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Country *</label>
                    <input type="text" value={form.country}
                      onChange={set('country')}
                      placeholder="e.g. Zambia" required className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Why do you want to join? *</label>
                    <textarea value={form.why_join} onChange={set('why_join')}
                      placeholder="Tell us why you're interested..."
                      required maxLength={300} rows={4}
                      className={inputClass} />
                    <p className="text-xs text-text-faint mt-1">
                      {charCount}/300 characters
                    </p>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={loading}
                      className="w-full bg-brand-black text-white py-4 rounded-lg text-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <p className="text-sm text-center text-text-faint mt-4">
                      Applications reviewed within 48 hours.
                      All outcomes communicated with reasons.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                What happens next
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  n: '1',
                  title: 'We review your application',
                  desc: 'Our team carefully reviews every submission'
                },
                {
                  n: '2',
                  title: 'You get a decision with feedback',
                  desc: 'Within 48 hours, with reasoning either way'
                },
                {
                  n: '3',
                  title: 'Approved creators get onboarded',
                  desc: 'And assigned their first test'
                },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-brand-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {step.n}
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

      </div>
    </PageWrapper>
  )
}
