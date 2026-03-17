import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface-muted border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-lg font-bold text-brand-black">
              TryMyApp<span className="font-normal">.uk</span>
            </span>
            <p className="text-sm text-text-secondary mt-2">
              Get actionable feedback on your unfinished apps.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">For Developers</h4>
            <div className="space-y-2">
              <Link href="/submit" className="block text-sm text-text-secondary hover:text-text-primary">Submit App</Link>
              <Link href="/dashboard" className="block text-sm text-text-secondary hover:text-text-primary">Dashboard</Link>
              <Link href="/#pricing" className="block text-sm text-text-secondary hover:text-text-primary">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">For Testers</h4>
            <div className="space-y-2">
              <Link href="/tests" className="block text-sm text-text-secondary hover:text-text-primary">Available Tests</Link>
              <Link href="/creators" className="block text-sm text-text-secondary hover:text-text-primary">Become a Creator</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Company</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-text-secondary hover:text-text-primary">About</Link>
              <Link href="/pricing" className="block text-sm text-text-secondary hover:text-text-primary">Pricing</Link>
              <Link href="/terms" className="block text-sm text-text-secondary hover:text-text-primary">Terms</Link>
              <Link href="/privacy" className="block text-sm text-text-secondary hover:text-text-primary">Privacy</Link>
              <Link href="/contact" className="block text-sm text-text-secondary hover:text-text-primary">Contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-surface-border mt-8 pt-8 text-center">
          <p className="text-sm text-text-faint">© 2026 TryMyApp.uk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}