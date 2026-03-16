'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-brand-black">
              TryMyApp<span className="font-normal">.uk</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Browse Apps
            </Link>
            <Link href="/creators" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Creators
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {loading ? null : user ? (
              <>
                <Link href="/dashboard" className="text-sm text-text-secondary hover:text-text-primary">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-text-secondary hover:text-text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-brand-black text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}