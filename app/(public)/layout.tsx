import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TryMyApp.uk — Get reviewed before your first thousand users',
  description: 'Submit your MVP. Get tested by curated creator-testers. Receive an AI report and a YouTube review your future users can find.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
