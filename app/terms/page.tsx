import PageWrapper from '@/components/layout/PageWrapper'

export default function TermsPage() {
  const lastUpdated = 'March 2026'

  return (
    <PageWrapper>
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-text-primary mb-4">
              Terms of Service
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
                TryMyApp.uk is an independent platform operated by
                Lusa Malungisha. We provide a service that connects
                developers with creator-testers and peer reviewers to
                give structured feedback on early-stage products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                2. Accounts
              </h2>
              <p className="mb-3">
                You must provide accurate information when creating an
                account. You are responsible for all activity that occurs
                under your account. We reserve the right to suspend or
                terminate accounts that violate these terms.
              </p>
              <p>
                Creator-tester accounts are by invitation only.
                Submitting an application does not guarantee approval.
                All applications are reviewed manually.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                3. Developer responsibilities
              </h2>
              <p className="mb-3">
                By submitting an app, you confirm that you have the
                right to share it and that it does not contain malicious
                code, illegal content, or content that violates the
                rights of others.
              </p>
              <p>
                Apps are reviewed by our team before being made visible
                to testers. We reserve the right to reject any submission
                without providing a reason.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                4. Payments
              </h2>
              <p className="mb-3">
                All payments are processed by Stripe. By making a payment
                you agree to Stripe&apos;s terms of service in addition to ours.
              </p>
              <p className="mb-3">
                Builder tier ($29) and Launch tier ($97 founding price)
                are one-time payments per app. Payments are
                non-refundable except where stated below.
              </p>
              <p>
                The founding price of $97 for the Launch tier is
                available for the first 50 slots only. After that,
                standard pricing applies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                5. Refund policy
              </h2>
              <p className="mb-3">
                Launch tier — full refund if no creator-tester is
                assigned to your app within 14 days of payment.
                To request a refund, contact us at
                lusamalungisha1@gmail.com with your order details.
              </p>
              <p className="mb-3">
                If a creator-tester begins testing but does not complete
                within 7 days of assignment, a partial refund of the
                platform fee may be issued at our discretion.
              </p>
              <p>
                Builder tier payments are non-refundable once the app
                has been approved and made visible to testers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                6. Creator-tester responsibilities
              </h2>
              <p className="mb-3">
                Creator-testers are independent contractors, not employees
                of TryMyApp.uk. By accepting a test assignment you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Complete the structured 6-step testing flow honestly</li>
                <li>Submit genuine, detailed feedback</li>
                <li>Publish a video review on your channel within 14 days of assignment for Launch tier apps</li>
                <li>Submit the video URL through the platform upon publication</li>
                <li>Not share confidential app details outside of the review context</li>
              </ul>
              <p>
                Payout is contingent on completion of all obligations
                above. We reserve the right to withhold payment for
                feedback deemed to be low quality or dishonest following
                a developer dispute.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                7. Intellectual property
              </h2>
              <p className="mb-3">
                Developers retain full ownership of their apps and any
                materials submitted to the platform. By submitting,
                you grant TryMyApp.uk a limited licence to display your
                app information to testers and feature it on our blog
                and social channels in connection with your review.
              </p>
              <p>
                Creator-testers retain ownership of their video content.
                By submitting a video URL, you grant TryMyApp.uk the right
                to embed and display the video on your app&apos;s page and
                our blog.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                8. Prohibited conduct
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit fake or malicious apps</li>
                <li>Submit fraudulent feedback</li>
                <li>Attempt to manipulate the platform or its users</li>
                <li>Use the platform to collect personal data from testers without their consent</li>
                <li>Reverse engineer, scrape, or copy the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                9. Limitation of liability
              </h2>
              <p>
                TryMyApp.uk is provided as-is. We make no guarantees
                about the quality of feedback received, the commercial
                success of any product reviewed, or the continued
                availability of the platform. To the maximum extent
                permitted by law, we are not liable for any indirect,
                incidental, or consequential damages arising from your
                use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                10. Changes to these terms
              </h2>
              <p>
                We may update these terms from time to time. Continued
                use of the platform after changes constitutes acceptance
                of the new terms. We will notify users of significant
                changes via email where possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                11. Contact
              </h2>
              <p>
                Questions about these terms?
                Email us at lusamalungisha1@gmail.com
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
