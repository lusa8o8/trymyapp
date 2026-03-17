'use client'

import PageWrapper from '@/components/layout/PageWrapper'

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

          <div className="mb-16">
            <h1 className="text-5xl font-bold text-text-primary mb-6">
              About
            </h1>
            <div className="w-16 h-1 bg-brand-black" />
          </div>

          <div className="bg-brand-black rounded-2xl p-8 mb-16">
            <p className="text-white text-xl leading-relaxed font-medium">
              Validation through peer reviews. Promotion through
              creator reviews. Structured, action-oriented feedback
              — without the chaos of invisible forum posts.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-text-secondary leading-relaxed text-lg">
              <p>
                I built TryMyApp.uk because I&apos;ve struggled to get
                real feedback on my own builds.
              </p>
              <p>
                I am a full time business student from Zambia, building
                apps with AI tools and learning by doing. The technical
                barrier has dropped significantly — AI has made code
                accessible to anyone with an idea. But just like ideas,
                code is cheap if it&apos;s not solving a real problem or
                simplifying a real workflow. I have good ideas and bad
                ones, and I need real people to tell me which is which.
              </p>
              <p>
                The platforms that exist are built for funded teams with
                polished products. Vibe coding forums give feedback, but
                it&apos;s fragmented, rarely actionable, and builders from
                different niches often see things from a single angle.
                Sometimes you&apos;re just invisible. App stores want a
                near-finished MVP before you even know if anyone wants it.
              </p>
              <p>
                I wanted a place to share a semi-finished build — not a
                pitch deck, not a polished product — and get structured,
                honest feedback from people who understand the early stage.
                Feedback that tells me what to fix before I spend six months
                on something nobody asked for.
              </p>
              <p>
                I built TryMyApp.uk for builders like me. Vibe coders who
                move fast, ship early, and need real validation before the
                build goes too far in the wrong direction. You don&apos;t
                need a million users. You need the right ten people to
                tell you the truth.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-surface-border">
              <p className="text-text-primary font-semibold text-lg">
                Lusa Malungisha
              </p>
              <p className="text-text-faint text-sm mt-1">
                Vibe Coder — Zambia
              </p>
            </div>
          </div>

          <div className="mt-16 pt-16 border-t border-surface-border">
            <h2 className="text-2xl font-bold text-text-primary mb-8">
              What we believe
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Incomplete builds deserve real feedback',
                  desc: 'You should not need a finished product to learn if your idea works. The earlier the feedback, the less time you waste building the wrong thing.'
                },
                {
                  title: 'Structured feedback beats noise',
                  desc: 'A random comment in a forum is not feedback. Structured, step-by-step testing with a focused report is. We built the infrastructure so every review is actionable.'
                },
                {
                  title: 'Creators are partners, not tools',
                  desc: 'We curate our creator-testers carefully. They are not hired hands — they are builders and content creators who genuinely engage with products in their niche.'
                },
                {
                  title: 'Distribution is part of the product',
                  desc: 'Getting reviewed on YouTube is not marketing. It is validation that lives on the internet permanently, searchable by your future users long after launch.'
                },
                {
                  title: 'We grow with our users',
                  desc: 'This platform was built by a builder who needed it. Every feature exists because someone building an MVP needed it to exist. We are not building for the enterprise — we are building for the person who just shipped their first thing.'
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1 bg-brand-black rounded-full flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  )
}
