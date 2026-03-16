'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PageWrapper from '@/components/layout/PageWrapper'
import Link from 'next/link'
import {
  ArrowLeft, FileText, RefreshCw, Loader2,
  TrendingUp, TrendingDown, Minus, Bug, Lightbulb,
  CheckCircle, AlertTriangle, Star, Users
} from 'lucide-react'

interface Report {
  id: string
  app_id: string
  summary: string
  ux_score_avg: number
  sentiment: 'positive' | 'neutral' | 'negative' | null
  top_issues: Array<{ issue: string; frequency: number; severity: string }>
  bugs: Array<{ description: string; frequency: number }>
  suggestions: Array<{ suggestion: string; votes: number }>
  would_use_pct: number
  priority_actions: string[]
  detailed_analysis: string | {
    overview: string
    ux_analysis: string
    bug_analysis: string
    suggestions_analysis: string
    action_items: string
  }
  generated_at: string | null
}

function SentimentBadge({ sentiment }: { sentiment: string | null | undefined }) {
  const colors = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-gray-100 text-gray-800',
    negative: 'bg-red-100 text-red-800'
  }
  const icons = {
    positive: <TrendingUp className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />,
    negative: <TrendingDown className="w-4 h-4" />
  }
  if (!sentiment) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        Unknown
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${colors[sentiment as keyof typeof colors] || colors.neutral}`}>
      {icons[sentiment as keyof typeof icons] || icons.neutral}
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-green-100 text-green-800'
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[severity as keyof typeof colors] || colors.low}`}>
      {severity}
    </span>
  )
}

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis'>('summary')

  const fetchReport = () => {
    setLoading(true)
    fetch(`/api/apps/${id}/reports`, { credentials: 'include' })
      .then(r => r.json())
      .then(({ data, error }) => {
        if (error) setError(error)
        else setReport(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load report')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchReport()
  }, [id])

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch(`/api/apps/${id}/reports/generate`, {
        method: 'POST',
        credentials: 'include'
      })
      const json = await res.json()
      if (json.error) setError(json.error)
      else if (json.data) setReport(json.data)
    } catch {
      setError('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-muted rounded w-1/3" />
            <div className="h-48 bg-surface-muted rounded-2xl" />
            <div className="h-64 bg-surface-muted rounded-2xl" />
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            {!report && (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Generate Report
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!report ? (
            <div className="bg-white rounded-2xl shadow-card p-12 text-center">
              <FileText className="w-16 h-16 text-text-faint mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                No Report Available
              </h2>
              <p className="text-text-secondary mb-6">
                Generate an AI-powered analysis report from your test feedback.
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                Generate AI Report
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-1">
                    AI Analysis Report
                  </h1>
                  <p className="text-text-secondary">
                    {report?.generated_at && report.generated_at !== null
                      ? `Generated ${new Date(report.generated_at).toLocaleDateString('en-US', { 
                          month: 'long', day: 'numeric', year: 'numeric' 
                        })}`
                      : 'Not yet generated'}
                  </p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Regenerate
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <p className="text-text-primary text-lg font-medium leading-relaxed">
                      {report.summary}
                    </p>
                  </div>
                  <SentimentBadge sentiment={report.sentiment} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                    <Star className="w-4 h-4" />
                    Avg UX Score
                  </div>
                  <div className="text-3xl font-bold text-text-primary">
                    {report.ux_score_avg}/5
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                    <Users className="w-4 h-4" />
                    Would Use
                  </div>
                  <div className="text-3xl font-bold text-text-primary">
                    {report.would_use_pct}%
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                    <Bug className="w-4 h-4" />
                    Bugs Found
                  </div>
                  <div className="text-3xl font-bold text-text-primary">
                    {report.bugs?.length ?? 0}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                    <Lightbulb className="w-4 h-4" />
                    Suggestions
                  </div>
                  <div className="text-3xl font-bold text-text-primary">
                    {report.suggestions?.length ?? 0}
                  </div>
                </div>
              </div>

              {report.priority_actions && report.priority_actions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Priority Actions
                  </h2>
                  <ul className="space-y-3">
                    {report.priority_actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-sm font-medium rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-text-primary">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.top_issues && report.top_issues.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Top Issues
                  </h2>
                  <div className="space-y-3">
                    {report.top_issues.map((issue, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-text-primary">{issue.issue}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-text-secondary text-sm">
                            {issue.frequency} {issue.frequency === 1 ? 'report' : 'reports'}
                          </span>
                          <SeverityBadge severity={issue.severity} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.bugs && report.bugs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-600" />
                    Bugs Reported
                  </h2>
                  <div className="space-y-2">
                    {report.bugs.map((bug, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-text-primary">{bug.description}</span>
                        <span className="text-text-secondary text-sm">
                          ×{bug.frequency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.suggestions && report.suggestions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Suggestions
                  </h2>
                  <div className="space-y-2">
                    {report.suggestions.map((sug, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-text-primary">{sug.suggestion}</span>
                        <span className="text-text-secondary text-sm">
                          {sug.votes} {sug.votes === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex border-b border-surface-border mb-6">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'summary'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'analysis'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Analysis
                  </button>
                </div>

                {activeTab === 'summary' && (
                  <p className="text-text-primary text-lg font-medium leading-relaxed">
                    {report.summary}
                  </p>
                )}

                {activeTab === 'analysis' && (
                  <div className="space-y-6">
                    {typeof report.detailed_analysis === 'string' ? (
                      <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">
                        {report.detailed_analysis}
                      </p>
                    ) : (
                      [
                        { key: 'overview', title: 'Overview', icon: '📊' },
                        { key: 'ux_analysis', title: 'UX Analysis', icon: '🎨' },
                        { key: 'bug_analysis', title: 'Bug Analysis', icon: '🐛' },
                        { key: 'suggestions_analysis', title: 'Suggestions Analysis', icon: '💡' },
                        { key: 'action_items', title: 'Action Items', icon: '✅' },
                      ].map(section => (
                        <div key={section.key} className="border-b border-surface-border pb-6 last:border-0 last:pb-0">
                          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <span>{section.icon}</span>
                            {section.title}
                          </h3>
                          <p className="text-text-secondary leading-relaxed text-sm">
                            {(report.detailed_analysis as Record<string, string>)[section.key]}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
