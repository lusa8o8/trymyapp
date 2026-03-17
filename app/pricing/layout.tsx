import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — TryMyApp.uk',
  description: 'Simple, honest pricing. Free, Builder $29, Launch $97 founding price.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
