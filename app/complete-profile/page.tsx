'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
export default function CompleteProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const setRole = async (role: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await fetch('/api/auth/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    })
    if (role === 'developer') router.push('/dashboard')
    else router.push('/tests')
  }
  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">One last thing</h1>
        <p className="text-text-secondary mb-8">What are you here to do?</p>
        <div className="space-y-4">
          <button onClick={() => setRole('developer')}
            className="w-full bg-brand-black text-white py-4 rounded-xl font-medium hover:bg-brand-dark transition-colors">
            I&apos;m a Developer — submit my app for testing
          </button>
          <button onClick={() => setRole('tester')}
            className="w-full border-2 border-brand-black text-brand-black py-4 rounded-xl font-medium hover:bg-surface-muted transition-colors">
            I&apos;m a Creator — test apps and earn
          </button>
        </div>
      </div>
    </div>
  )
}