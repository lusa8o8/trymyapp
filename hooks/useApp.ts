'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { App } from '@/types/database'

export function useApps() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('apps')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setApps(data ?? [])
        setLoading(false)
      })
  }, [])

  return { apps, loading, error }
}

export function useApp(id: string) {
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()

    supabase
      .from('apps')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setApp(data)
        setLoading(false)
      })
  }, [id])

  return { app, loading, error }
}