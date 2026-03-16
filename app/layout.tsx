import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TryMyApp.uk',
  description: 'Get real feedback on your app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
