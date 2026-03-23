'use client'

import { useEffect, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/badge'
import type { App, User } from '@/types/database'

type AppWithDeveloper = App & { developer: { display_name: string | null; email: string } }

interface CreatorApplication {
  id: string
  name: string
  email: string
  content_url: string
  niche: string
  follower_range: string
  country: string
  why_join: string
  status: string
  rejection_reason: string | null
  created_at: string
  reviewed_at: string | null
}

export default function AdminDashboard() {
  const [apps, setApps] = useState<AppWithDeveloper[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [applications, setApplications] = useState<CreatorApplication[]>([])
  const [tab, setTab] = useState<'pending' | 'all' | 'users' | 'applications' | 'payouts'>('pending')
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedRejectRow, setExpandedRejectRow] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/apps', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/users', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/applications', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/payouts', { credentials: 'include' }).then(r => r.json()),
    ]).then(([appsRes, usersRes, appsRes2, payoutsRes]) => {
      setApps(appsRes.data ?? [])
      setUsers(usersRes.data ?? [])
      setApplications(appsRes2.data ?? [])
      setPayouts(payoutsRes.data ?? [])
      setLoading(false)
    })
  }, [])

  const updateStatus = async (appId: string, status: string) => {
    setActionLoading(appId)
    const res = await fetch(`/api/apps/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    })
    if (res.ok) {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: status as App['status'] } : a))
    }
    setActionLoading(null)
  }

  const handleApprove = async (appId: string) => {
    await fetch(`/api/admin/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'approved' })
    })
    setApplications(prev => prev.map(a =>
      a.id === appId ? { ...a, status: 'approved' } : a
    ))
  }

  const handleReject = async (appId: string) => {
    await fetch(`/api/admin/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'rejected', rejection_reason: rejectionReason })
    })
    setApplications(prev => prev.map(a =>
      a.id === appId ? { ...a, status: 'rejected' } : a
    ))
    setExpandedRejectRow(null)
    setRejectionReason('')
  }

  const pendingApps = apps.filter(a => a.status === 'pending')
  const pendingApplications = applications.filter(a => a.status === 'pending')
  const tabs = [
    { id: 'pending', label: `Pending Review (${pendingApps.length})` },
    { id: 'all', label: 'All Apps' },
    { id: 'users', label: 'Users' },
    { id: 'applications', label: `Applications (${pendingApplications.length})` },
    { id: 'payouts', label: `Payouts` },
  ]

  return (
    <PageWrapper>
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-1">Admin Dashboard</h1>
            <p className="text-text-secondary">Platform overview and monitoring</p>
          </div>

          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card mb-8 w-fit">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-brand-black text-white' : 'text-text-secondary hover:text-text-primary'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-text-faint">Loading...</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {tab === 'pending' && (
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      {['App Name', 'Developer', 'Category', 'Submitted', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-faint uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {pendingApps.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-text-faint">No apps pending review</td></tr>
                    ) : pendingApps.map(app => (
                      <tr key={app.id} className="hover:bg-surface-muted transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-text-primary">{app.name}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {app.developer?.display_name || app.developer?.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{app.category}</td>
                        <td className="px-6 py-4 text-sm text-text-faint">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(app.id, 'active')}
                              disabled={actionLoading === app.id}
                              className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, 'rejected')}
                              disabled={actionLoading === app.id}
                              className="px-3 py-1.5 bg-danger text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === 'all' && (
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      {['App Name', 'Developer', 'Status', 'Tier', 'Submitted'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-faint uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {apps.map(app => (
                      <tr key={app.id} className="hover:bg-surface-muted transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-text-primary">{app.name}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {app.developer?.display_name || app.developer?.email}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            app.status === 'active' ? 'success' :
                            app.status === 'pending' ? 'warning' : 'danger'
                          }>{app.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={app.tier === 'launch' ? 'black' : app.tier === 'builder' ? 'info' : 'default'}>
                            {app.tier}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-faint">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === 'users' && (
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      {['Email', 'Role', 'Joined'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-faint uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-surface-muted transition-colors">
                        <td className="px-6 py-4 text-sm text-text-primary">{user.email}</td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            user.role === 'admin' ? 'black' :
                            user.role === 'developer' ? 'info' : 'default'
                          }>{user.role}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-faint">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === 'applications' && (
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      {['Name', 'Content URL', 'Niche', 'Followers', 'Country', 'Applied', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-faint uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {applications.length === 0 ? (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-text-faint">No applications yet</td></tr>
                    ) : applications.map(app => (
                      <tr key={app.id} className="hover:bg-surface-muted transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-text-primary">{app.name}</td>
                        <td className="px-6 py-4 text-sm">
                          <a href={app.content_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Link
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{app.niche}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{app.follower_range}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{app.country}</td>
                        <td className="px-6 py-4 text-sm text-text-faint">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            app.status === 'approved' ? 'success' :
                            app.status === 'rejected' ? 'danger' : 'warning'
                          }>{app.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          {app.status === 'pending' && (
                            <div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => setExpandedRejectRow(
                                    expandedRejectRow === app.id ? null : app.id
                                  )}
                                  className="px-3 py-1.5 bg-danger text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                              {expandedRejectRow === app.id && (
                                <div className="mt-3 space-y-2">
                                  <textarea
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    rows={3}
                                    className="w-full px-3 py-2 text-xs border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-black"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleReject(app.id)}
                                      className="px-3 py-1.5 bg-danger text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                      Confirm Reject
                                    </button>
                                    <button
                                      onClick={() => { setExpandedRejectRow(null); setRejectionReason('') }}
                                      className="px-3 py-1.5 bg-surface-muted text-text-secondary text-xs font-medium rounded-lg hover:bg-surface-border transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === 'payouts' && (
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-surface-border">
                    <h2 className="text-lg font-semibold text-text-primary">
                      Creator Payouts
                    </h2>
                    <p className="text-sm text-text-faint mt-1">
                      Completed Launch tier tests with video reviews submitted
                    </p>
                  </div>
                  {payouts.length === 0 ? (
                    <div className="p-12 text-center text-text-faint">
                      No payouts pending
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-surface-muted">
                        <tr>
                          {['Creator', 'App', 'Video', 'Completed', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-faint uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border">
                        {payouts.map((payout: any) => (
                          <tr key={payout.id} className="hover:bg-surface-muted transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-text-primary">
                                {payout.users?.display_name || payout.users?.email}
                              </div>
                              <div className="text-xs text-text-faint">
                                {payout.users?.channel_name || payout.users?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-text-primary">
                              {payout.apps?.name}
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={payout.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-brand-black underline hover:text-brand-dark"
                              >
                                Watch video
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm text-text-faint">
                              {new Date(payout.completed_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payout.payout_status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {payout.payout_status === 'paid' ? 'Payout Sent' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {payout.payout_status !== 'paid' && (
                                <button
                                  onClick={async () => {
                                    await fetch('/api/admin/payouts', {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({
                                        test_id: payout.id,
                                        payout_status: 'paid'
                                      })
                                    })
                                    setPayouts(prev => prev.map(p =>
                                      p.id === payout.id
                                        ? { ...p, payout_status: 'paid' }
                                        : p
                                    ))
                                  }}
                                  className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  Process Payout
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
