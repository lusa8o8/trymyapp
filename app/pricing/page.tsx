import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { Check } from 'lucide-react'

export default async function PricingPage() {
  const statsRes = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/stats`,
    { next: { revalidate: 60 } }
  )
  const statsData = await statsRes.json()
  const slotsRemaining = statsData?.data?.founding_slots_remaining ?? 50

  return (
    <PageWrapper>
      <div className="bg-white min-h-screen">

        <div className="bg-white border-b border-surface-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-5xl font-bold text-text-primary mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              You are not paying for feedback. Feedback is free on Reddit.
              You are paying for structured insight and permanent organic
              distribution.
            </p>
          </div>
        </div>

        <div className="bg-brand-black py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/80 text-sm">
              Unfinished builds welcome. You do not need a polished product
              to get started — that is the point.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">

            <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-card">
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                FREE
              </h3>
              <div className="text-4xl font-bold text-text-primary mb-1">
                $0
              </div>
              <p className="text-text-faint text-sm mb-6">forever</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Listed in browse feed',
                  'Peer review from community developers',
                  'Basic structured feedback',
                  'No time limit',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                    <Check className="w-4 h-4 text-text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-lg border-2 border-brand-black text-brand-black font-medium hover:bg-surface-muted transition-colors text-sm">
                Get Started Free
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-brand-black shadow-hover md:-translate-y-2">
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                BUILDER
              </h3>
              <div className="text-4xl font-bold text-text-primary mb-1">
                $29
              </div>
              <p className="text-text-faint text-sm mb-6">one-time per app</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Featured placement — more testers see your app first',
                  'AI-generated report synthesising all feedback',
                  'Issues, bugs, suggestions, sentiment score',
                  'Priority actions — what to fix first',
                  'Analytics dashboard — who tested what and when',
                  'One payment, yours forever',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                    <Check className="w-4 h-4 text-text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-lg bg-brand-black text-white font-medium hover:bg-brand-dark transition-colors text-sm">
                Get Builder
              </Link>
            </div>

            <div>
            {slotsRemaining <= 10 && (
              <div className="bg-danger text-white text-xs font-medium text-center py-2 rounded-t-2xl -mb-2 relative z-10">
                Only {slotsRemaining} slots left at founding price
              </div>
            )}
            <div className="bg-brand-black rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-brand-black px-4 py-1 rounded-full text-xs font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                LAUNCH
              </h3>
              <div className="text-4xl font-bold text-white mb-1">
                $97
              </div>
              <p className="text-white/60 text-sm mb-6">
                founding price — 50 slots only
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Builder',
                  'Guaranteed creator-tester assigned within 14 days',
                  'Creator publishes a video review on their channel',
                  'That video lives on the internet permanently',
                  'Searchable by your future users long after launch',
                  'Featured on our blog with video thumbnail',
                  'Full refund if no creator assigned in 14 days',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/90 text-sm">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-lg bg-white text-brand-black font-bold hover:bg-white/90 transition-colors text-sm mb-3">
                Get Launch
              </Link>
              <div className="text-center text-xs text-white/60">
                {slotsRemaining} of 50 founding slots remaining
              </div>
            </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
              What you are actually paying for
            </h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  Builder — structured insight
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  You are serious about your product. You want more than
                  a few comments — you want to know exactly what is broken,
                  what is confusing, what testers would change, and what
                  to fix first. The AI report synthesises everything into
                  a structured document you can act on immediately. The
                  analytics dashboard shows you real engagement data —
                  not guesses. One payment, and the data is yours forever.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  Launch — permanent organic distribution
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  A YouTube video review is not marketing spend — it is
                  permanent content that lives on the internet and compounds
                  over time. A video posted today is still driving traffic
                  in three years. Your future users can find it by searching
                  your app name. The creator who reviews your app has a real
                  audience in your niche — people who are already interested
                  in the kind of product you are building. That is
                  distribution that no ad budget can replicate at this price.
                </p>
              </div>
              <div className="bg-surface-muted rounded-2xl p-8">
                <p className="text-text-primary font-medium text-lg leading-relaxed">
                  &ldquo;You do not need a polished product to get started.
                  Submit your half-built idea. Get real feedback.
                  Build what people actually want.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-24">
            <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
              Common questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  q: 'Can I submit an unfinished app?',
                  a: 'Yes. That is exactly who this is for. You do not need a polished product — you need honest feedback before you spend more time building in the wrong direction.'
                },
                {
                  q: 'What if no creator is assigned within 14 days?',
                  a: 'You get a full refund. No questions asked. We only charge you when we deliver.'
                },
                {
                  q: 'Is the Launch tier price going up?',
                  a: 'Yes. The founding price is available for the first 50 slots only. After that, the price increases. Early builders get the best deal.'
                },
                {
                  q: 'Can I upgrade from Free or Builder later?',
                  a: 'Yes. You can upgrade any app at any time from your dashboard.'
                },
                {
                  q: 'Who are the creator-testers?',
                  a: 'We curate every creator manually. They are content creators with real audiences in specific niches — tech, finance, lifestyle, education, and more. They are selected for genuine curiosity about products, not follower count.'
                },
                {
                  q: 'What is peer review?',
                  a: 'Developers on the free tier can test each other\'s apps and submit structured feedback. It is builders helping builders — no payout, just community. You can both submit your app and test others.'
                },
              ].map((item, i) => (
                <div key={i} className="border-b border-surface-border pb-8 last:border-0">
                  <h3 className="font-semibold text-text-primary mb-2">
                    {item.q}
                  </h3>
                  <p className="text-text-secondary">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
