import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Become a Creator-Tester — TryMyApp.uk',
  description: 'Join a curated network of creator-testers. Get early access to MVPs, earn $50 per video review.',
}

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
