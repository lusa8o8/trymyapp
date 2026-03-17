import PageWrapper from '@/components/layout/PageWrapper'

export default function PrivacyPage() {
  const lastUpdated = 'March 2026'

  return (
    <PageWrapper>
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-text-faint text-sm">
              Last updated: {lastUpdated}
            </p>
            <div className="w-16 h-1 bg-brand-black mt-6" />
          </div>

          <div className="space-y-12 text-text-secondary leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                1. Who we are
              </h2>
              <p>
                TryMyApp.uk is operated by Lusa Malungisha. This policy
                explains what data we collect, why we collect it, and
                how we use it. If you have questions, contact us at
                lusamalungisha1@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                2. What data we collect
              </h2>
              <p className="mb-3">
                <strong className="text-text-primary">
                  Account information:
                </strong>{' '}
                Email address, display name, and role when you create
                an account.
              </p>
              <p className="mb-3">
                <strong className="text-text-primary">
                  App submission data:
                </strong>{' '}
                App name, URL, description, instructions, screenshots,
                and any other information you provide when submitting
                an app.
              </p>
              <p className="mb-3">
                <strong className="text-text-primary">
                  Feedback data:
                </strong>{' '}
                Ratings, written feedback, bug reports, and suggestions
                submitted during testing.
              </p>
              <p className="mb-3">
                <strong className="text-text-primary">
                  Creator application data:
                </strong>{' '}
                Name, email, content URL, niche, follower range, country,
                and your application statement.
              </p>
              <p className="mb-3">
                <strong className="text-text-primary">
                  Payment data:
                </strong>{' '}
                We do not store card details. Payments are processed
                by Stripe. We store transaction records including amount,
                tier purchased, and payment status.
              </p>
              <p>
                <strong className="text-text-primary">
                  Usage data:
                </strong>{' '}
                Page views, test sessions, and interaction events used
                to provide analytics to developers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                3. How we use your data
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To operate the platform and provide our services</li>
                <li>To match creator-testers with relevant apps based on niche</li>
                <li>To generate AI reports from aggregated feedback data</li>
                <li>To process payments and manage refunds</li>
                <li>To display creator profiles and video reviews on app pages</li>
                <li>To send transactional emails relating to your account, app status, or application outcome</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                4. Data sharing
              </h2>
              <p className="mb-3">
                We do not sell your data. We share data only with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-text-primary">Supabase</strong> — our database and authentication provider</li>
                <li><strong className="text-text-primary">Stripe</strong> — our payment processor</li>
                <li><strong className="text-text-primary">Anthropic</strong> — feedback data is sent to Claude to generate AI reports. No personally identifiable information is included in report generation prompts.</li>
                <li><strong className="text-text-primary">Vercel</strong> — our hosting provider</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                5. Data retention
              </h2>
              <p>
                We retain your account data for as long as your account
                is active. App submissions, feedback, and analytics data
                are retained indefinitely to provide historical reporting
                to developers. You may request deletion of your account
                and associated data at any time by emailing
                lusamalungisha1@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                6. Your rights
              </h2>
              <p className="mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at
                lusamalungisha1@gmail.com. We will respond within
                30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                7. Cookies
              </h2>
              <p>
                We use essential cookies only — specifically the
                authentication session cookie required to keep you
                logged in. We do not use tracking cookies or
                third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                8. Security
              </h2>
              <p>
                We use industry-standard security practices including
                encrypted connections (HTTPS), secure authentication
                via Supabase, and row-level security on our database.
                No system is perfectly secure — if you discover a
                vulnerability, please disclose it responsibly by
                emailing lusamalungisha1@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                9. Changes to this policy
              </h2>
              <p>
                We may update this policy from time to time. We will
                notify users of significant changes via email where
                possible. Continued use of the platform after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
