'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Sparkles } from 'lucide-react'

export default function CompleteProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleCreator = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await fetch('/api/auth/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: 'tester' })
    })

    router.push('/onboarding/creator')
  }

  const handleDeveloper = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await fetch('/api/auth/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: 'developer' })
    })

    router.push('/onboarding/developer')
  }

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          One last thing
        </h1>
        <p className="text-text-secondary mb-8">
          What are you here to do?
        </p>
        <div className="space-y-4">
          <button
            onClick={handleDeveloper}
            disabled={loading}
            className="w-full bg-brand-black text-white py-4 rounded-xl font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            I&apos;m a Developer — submit my app for testing
          </button>
          <button
            onClick={handleCreator}
            disabled={loading}
            className="w-full border-2 border-brand-black text-brand-black py-4 rounded-xl font-medium hover:bg-surface-muted transition-colors disabled:opacity-50"
          >
            I&apos;m a Creator — test apps and earn
          </button>
        </div>
        <p className="text-xs text-text-faint mt-6">
          Creators apply through our application process at{' '}
          <a href="/creators" className="underline hover:text-text-primary">
            trymyapp.uk/creators
          </a>
        </p>
      </div>
    </div>
  )
}
