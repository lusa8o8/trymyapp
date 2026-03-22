'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { Upload } from 'lucide-react'

const CATEGORIES = ['SaaS', 'Tools', 'Productivity', 'Games', 'Social',
  'Education', 'Health & Fitness', 'Finance', 'Other']
const STAGES = ['Idea / Concept', 'Prototype', 'Beta', 'Launched']

export default function SubmitAppPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '', url: '', category: '', stage: '', target_user: '',
    specific_feedback: '', description: '', instructions: '',
    demo_email: '', demo_password: ''
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = 8 - screenshots.length
    const toUpload = files.slice(0, remaining)

    if (toUpload.length === 0) {
      setUploadError('Maximum 8 screenshots allowed')
      return
    }

    setUploading(true)
    setUploadError(null)

    const uploaded: string[] = []

    for (const file of toUpload) {
      if (file.size > 500 * 1024) {
        setUploadError(`${file.name} exceeds 500KB limit`)
        continue
      }

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/apps/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const result = await res.json()

      if (!res.ok) {
        setUploadError(result.error)
      } else {
        uploaded.push(result.url)
      }
    }

    setScreenshots(prev => [...prev, ...uploaded])
    setUploading(false)

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...form,
        screenshot_url: screenshots[0] ?? null,
        screenshots: screenshots
      })
    })
    const result = await res.json()

    if (!res.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent text-sm"
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5"

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Submit Your App</h1>
            <p className="text-text-secondary">Fill in the details below to get your app tested</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">Basic Information</h2>
                <div>
                  <label className={labelClass}>App Name *</label>
                  <input type="text" value={form.name} onChange={set('name')}
                    placeholder="e.g., FitTrack Pro" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>App URL *</label>
                  <input type="url" value={form.url} onChange={set('url')}
                    placeholder="https://yourapp.com" required className={inputClass} />
                  <p className="text-xs text-text-faint mt-1">Link to your live app or staging environment</p>
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={form.category} onChange={set('category')} required className={inputClass}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>App Stage *</label>
                  <select value={form.stage} onChange={set('stage')} required className={inputClass}>
                    <option value="">Select stage</option>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Target User *</label>
                  <input type="text" value={form.target_user} onChange={set('target_user')}
                    placeholder="e.g. Freelance designers who invoice clients" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>What specific feedback do you need? *</label>
                  <textarea value={form.specific_feedback} onChange={set('specific_feedback')}
                    placeholder="e.g. Is the onboarding clear? Does the pricing page make sense?" required rows={3} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Description *</label>
                  <textarea value={form.description} onChange={set('description')}
                    placeholder="Describe your app, its main features, and what makes it unique..."
                    required rows={4} className={inputClass} />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-surface-border">
                <h2 className="text-lg font-semibold text-text-primary">Testing Instructions</h2>
                <div>
                  <label className={labelClass}>Step-by-step Instructions *</label>
                  <textarea value={form.instructions} onChange={set('instructions')}
                    placeholder={"1. Create an account\n2. Complete the onboarding\n3. Try the main feature\n..."}
                    required rows={6} className={`${inputClass} font-mono`} />
                  <p className="text-xs text-text-faint mt-1">Provide clear steps for testers to follow</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-surface-border">
                <h2 className="text-lg font-semibold text-text-primary">Demo Account <span className="text-text-faint font-normal">(Optional)</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Demo Email</label>
                    <input type="email" value={form.demo_email} onChange={set('demo_email')}
                      placeholder="demo@yourapp.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Demo Password</label>
                    <input type="text" value={form.demo_password} onChange={set('demo_password')}
                      placeholder="demo123" className={inputClass} />
                  </div>
                </div>
                <p className="text-xs text-text-faint">Provide test credentials if your app requires login</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-surface-border">
                <h2 className="text-lg font-semibold text-text-primary">Screenshots</h2>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-surface-border rounded-xl p-8 text-center hover:border-brand-black transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 mx-auto mb-2 text-text-faint" />
                    {uploading ? (
                      <p className="text-sm text-text-secondary">Uploading...</p>
                    ) : (
                      <>
                        <p className="text-sm text-text-secondary">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-text-faint mt-1">
                          PNG, JPG up to 500KB each — max 8 screenshots
                        </p>
                      </>
                    )}
                    {screenshots.length > 0 && (
                      <p className="text-xs text-brand-black mt-2 font-medium">
                        {screenshots.length}/8 uploaded
                      </p>
                    )}
                  </div>

                  {uploadError && (
                    <p className="text-xs text-danger">{uploadError}</p>
                  )}

                  {screenshots.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {screenshots.map((url, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden aspect-video bg-surface-muted">
                          <img
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeScreenshot(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-surface-border">
                <div className="bg-surface-muted rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-semibold text-text-primary mb-2">📊 What happens next?</h3>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Your app will be reviewed within 24 hours</li>
                    <li>• Once approved, testers can start testing</li>
                    <li>• You'll receive structured feedback and an AI report</li>
                    <li>• Upgrade to Builder ($29) or Launch ($97 founding) for featured placement + guaranteed YouTube review</li>
                  </ul>
                </div>
                <div className="flex gap-4">
                  <Link href="/dashboard"
                    className="flex-1 text-center py-3 rounded-lg border border-surface-border text-text-primary font-medium hover:bg-surface-muted transition-colors">
                    Cancel
                  </Link>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-brand-black text-white py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Submit App'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}