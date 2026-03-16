'use client'

import { useEffect, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/badge'
import type { App, User } from '@/types/database'

type AppWithDeveloper = App & { developer: { display_name: string | null; email: string } }

export default function AdminDashboard() {
  const [apps, setApps] = useState<AppWithDeveloper[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [tab, setTab] = useState<'pending' | 'all' | 'users'>('pending')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/apps').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json())
    ]).then(([appsRes, usersRes]) => {
      setApps(appsRes.data ?? [])
      setUsers(usersRes.data ?? [])
      setLoading(false)
    })
  }, [])

  const updateStatus = async (appId: string, status: string) => {
    setActionLoading(appId)
    const res = await fetch(`/api/apps/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (res.ok) {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: status as App['status'] } : a))
    }
    setActionLoading(null)
  }

  const pendingApps = apps.filter(a => a.status === 'pending')
  const tabs = [
    { id: 'pending', label: `Pending Review (${pendingApps.length})` },
    { id: 'all', label: 'All Apps' },
    { id: 'users', label: 'Users' }
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
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}