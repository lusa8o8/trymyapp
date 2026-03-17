import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — TryMyApp.uk',
  description: 'TryMyApp.uk terms of service.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
