import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — TryMyApp.uk',
  description: 'Get in touch with TryMyApp.uk.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
