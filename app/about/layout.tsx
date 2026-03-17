import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — TryMyApp.uk',
  description: 'Why TryMyApp.uk exists. Built by a vibe coder who needed it.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
