'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PageWrapper from '@/components/layout/PageWrapper'
import { CheckCircle, Circle, ExternalLink, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Test {
  id: string
  app_id: string
  status: string
  apps: {
    name: string
    url: string
    instructions: string
    description: string
  }
}

const STEPS = [
  { id: 1, title: 'Open the app', description: 'Visit the app URL and explore the interface' },
  { id: 2, title: 'Follow instructions', description: 'Complete the testing steps provided by the developer' },
  { id: 3, title: 'Test core features', description: 'Try the main functionality of the app' },
  { id: 4, title: 'Note any issues', description: 'Pay attention to bugs, confusing UI, or missing features' },
  { id: 5, title: 'Rate your experience', description: 'How intuitive and useful was the app?' },
  { id: 6, title: 'Submit feedback', description: 'Share your detailed findings with the developer' },
]

export default function TestFlowPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const [uxRating, setUxRating] = useState<number>(0)
  const [uxFeedback, setUxFeedback] = useState('')
  const [bugReport, setBugReport] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [wouldUse, setWouldUse] = useState<boolean | null>(null)
  const [checklistDone, setChecklistDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('tests')
      .select('*, apps(name, url, instructions, description)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setTest(data)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId])
    }
    if (stepId < 6) setCurrentStep(stepId + 1)
  }

  const handleSubmit = async () => {
    if (uxRating === 0) {
      alert('Please rate your UX experience before submitting')
      return
    }
    setSubmitting(true)

    const feedbackRes = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        test_id: id,
        ux_rating: uxRating,
        ux_feedback: uxFeedback,
        bug_report: bugReport,
        suggestions,
        checklist_done: checklistDone,
        would_use: wouldUse
      })
    })

    if (!feedbackRes.ok) {
      setSubmitting(false)
      alert('Failed to submit feedback. Please try again.')
      return
    }

    await fetch('/api/tests/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ test_id: id })
    })

    router.push('/tests?completed=true')
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-muted rounded w-1/3" />
            <div className="h-64 bg-surface-muted rounded-2xl" />
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!test) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-text-faint">Test not found</p>
        </div>
      </PageWrapper>
    )
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-brand-black text-sm"

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Testing: {test.apps.name}
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Complete all steps and submit your feedback
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-card">
              <Clock className="w-4 h-4 text-text-faint" />
              <span className="font-mono text-text-primary font-medium">
                {formatTime(elapsed)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-semibold text-text-primary mb-4">Test Steps</h2>
              <div className="space-y-3">
                {STEPS.map(step => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                      currentStep === step.id
                        ? 'bg-brand-black text-white'
                        : 'hover:bg-surface-muted'
                    }`}
                  >
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                        currentStep === step.id ? 'text-white' : 'text-success'
                      }`} />
                    ) : (
                      <Circle className={`w-5 h-5 flex-shrink-0 ${
                        currentStep === step.id ? 'text-white' : 'text-text-faint'
                      }`} />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${
                        currentStep === step.id ? 'text-white' : 'text-text-primary'
                      }`}>
                        Step {step.id}
                      </p>
                      <p className={`text-xs ${
                        currentStep === step.id ? 'text-white/70' : 'text-text-faint'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-surface-border">
                <div className="text-xs text-text-faint mb-1">Progress</div>
                <div className="w-full bg-surface-muted rounded-full h-2">
                  <div
                    className="bg-brand-black h-2 rounded-full transition-all"
                    style={{ width: `${(completedSteps.length / 6) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-text-faint mt-1">
                  {completedSteps.length}/6 steps completed
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {currentStep <= 5 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 bg-brand-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {currentStep}
                    </span>
                    <h2 className="text-lg font-semibold text-text-primary">
                      {STEPS[currentStep - 1].title}
                    </h2>
                  </div>
                  <p className="text-text-secondary mb-4">
                    {STEPS[currentStep - 1].description}
                  </p>

                  {currentStep === 1 && (
                    <a
                      href={test.apps.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors mb-4"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open {test.apps.name}
                    </a>
                  )}

                  {currentStep === 2 && (
                    <div className="bg-surface-muted rounded-xl p-4 mb-4">
                      <pre className="text-sm text-text-secondary whitespace-pre-wrap font-mono">
                        {test.apps.instructions}
                      </pre>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Bug Report
                      </label>
                      <textarea
                        value={bugReport}
                        onChange={e => setBugReport(e.target.value)}
                        placeholder="Describe any bugs or issues you encountered..."
                        rows={4}
                        className={inputClass}
                      />
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          UX Rating
                        </label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(r => (
                            <button
                              key={r}
                              onClick={() => setUxRating(r)}
                              className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                                uxRating >= r
                                  ? 'bg-brand-black text-white'
                                  : 'bg-surface-muted text-text-secondary hover:bg-surface-border'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          UX Feedback
                        </label>
                        <textarea
                          value={uxFeedback}
                          onChange={e => setUxFeedback(e.target.value)}
                          placeholder="What was your experience like? What worked well?"
                          rows={3}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          Would you use this app?
                        </label>
                        <div className="flex gap-3">
                          {[
                            { value: true, label: 'Yes' },
                            { value: false, label: 'No' }
                          ].map(opt => (
                            <button
                              key={String(opt.value)}
                              onClick={() => setWouldUse(opt.value)}
                              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                wouldUse === opt.value
                                  ? 'bg-brand-black text-white'
                                  : 'bg-surface-muted text-text-secondary hover:bg-surface-border'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => completeStep(currentStep)}
                    className="bg-brand-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
                  >
                    {currentStep === 5 ? 'Continue to Submit' : 'Mark Complete & Next'}
                  </button>
                </div>
              )}

              {currentStep === 6 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 bg-brand-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      6
                    </span>
                    <h2 className="text-lg font-semibold text-text-primary">
                      Submit Your Feedback
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Suggestions for improvement
                      </label>
                      <textarea
                        value={suggestions}
                        onChange={e => setSuggestions(e.target.value)}
                        placeholder="What would make this app better?"
                        rows={3}
                        className={inputClass}
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklistDone}
                        onChange={e => setChecklistDone(e.target.checked)}
                        className="w-4 h-4 accent-brand-black"
                      />
                      <span className="text-sm text-text-secondary">
                        I completed all testing steps in the checklist
                      </span>
                    </label>

                    <div className="bg-surface-muted rounded-xl p-4">
                      <h3 className="text-sm font-medium text-text-primary mb-2">
                        Feedback Summary
                      </h3>
                      <div className="space-y-1 text-sm text-text-secondary">
                        <div>UX Rating: {uxRating > 0 ? `${uxRating}/5` : 'Not rated'}</div>
                        <div>Would use: {wouldUse === null ? 'Not answered' : wouldUse ? 'Yes' : 'No'}</div>
                        <div>Bugs reported: {bugReport ? 'Yes' : 'None'}</div>
                        <div>Steps completed: {completedSteps.length}/6</div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting || uxRating === 0}
                      className="w-full bg-brand-black text-white py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
