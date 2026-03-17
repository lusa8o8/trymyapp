import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — TryMyApp.uk',
  description: 'TryMyApp.uk privacy policy.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
