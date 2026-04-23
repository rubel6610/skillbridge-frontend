'use client'

import { LayoutDashboard, ShieldCheck, UserCircle } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'

const TutorDashboard = () => {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading dashboard...</div>
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/15 p-3">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user?.name ? `Welcome back, ${user.name}` : 'Tutor dashboard'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
              This dashboard now reads from the shared auth hook, so we can reuse
              the same logged-in user state across navbar, dashboard, and profile pages.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <UserCircle className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-900">Account</h2>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><span className="font-medium text-slate-900">Name:</span> {user?.name || 'Unavailable'}</p>
            <p><span className="font-medium text-slate-900">Email:</span> {user?.email || 'Unavailable'}</p>
            <p><span className="font-medium text-slate-900">Role:</span> {user?.role || 'Unavailable'}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Session state</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            {isAuthenticated
              ? 'You are signed in and your shared auth state is available across tutor pages.'
              : 'No active session found. Please sign in again to continue.'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default TutorDashboard
