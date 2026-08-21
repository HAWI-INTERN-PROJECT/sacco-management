import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  Hourglass,
  Users,
  Wallet,
  Loader2,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  XCircle,
  Check,
  X,
  PieChart as PieChartIcon,
} from 'lucide-react'
import { MetricCard } from '../../components/super-admin/MetricCard'
import { toast } from 'sonner'
import { adminSaccoService } from '../../services/adminSaccoService'
import type { Sacco, DashboardStats } from '../../types'

export const SuperAdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingList, setPendingList] = useState<Sacco[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, pendingRes] = await Promise.all([
        adminSaccoService.getDashboardStats(),
        adminSaccoService.getSaccos({ status: 'pending' }),
      ])

      if (statsRes.data) {
        setStats(statsRes.data)
      }

      if (pendingRes) {
        setPendingList(pendingRes.data || [])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard statistics.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleApprove = async (sacco: Sacco) => {
    setActionLoadingId(sacco.id)
    try {
      await adminSaccoService.approveSacco(sacco.id)
      toast.success(`${sacco.name} approved successfully!`)
      fetchDashboardData()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve SACCO.'
      toast.error(msg)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (sacco: Sacco) => {
    setActionLoadingId(sacco.id)
    try {
      await adminSaccoService.rejectSacco(sacco.id)
      toast.error(`${sacco.name} rejected.`)
      fetchDashboardData()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject SACCO.'
      toast.error(msg)
    } finally {
      setActionLoadingId(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Calculate percentages for donut distribution
  const total = stats?.total_saccos || 1
  const approvedPct = Math.round(((stats?.approved_saccos || 0) / total) * 100)
  const pendingPct = Math.round(((stats?.pending_saccos || 0) / total) * 100)
  const rejectedPct = Math.round(((stats?.rejected_saccos || 0) / total) * 100)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time overview of cooperative registrations, platform metrics, and system status.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/super-admin/saccos"
            className="inline-flex items-center gap-2 bg-[#0B1727] hover:bg-[#0B1727]/90 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            <span>Manage SACCOs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="TOTAL SACCOS"
          value={loading ? '...' : (stats?.total_saccos ?? 0).toLocaleString()}
          icon={Building2}
          accentColor="black"
        />
        <MetricCard
          title="APPROVED SACCOS"
          value={loading ? '...' : (stats?.approved_saccos ?? 0).toLocaleString()}
          icon={CheckCircle2}
          accentColor="green"
        />
        <MetricCard
          title="PENDING APPROVAL"
          value={loading ? '...' : (stats?.pending_saccos ?? 0).toLocaleString()}
          icon={Hourglass}
          accentColor="amber"
          bgHighlight={true}
        />
        <MetricCard
          title="REJECTED SACCOS"
          value={loading ? '...' : (stats?.rejected_saccos ?? 0).toLocaleString()}
          icon={XCircle}
          accentColor="rose"
        />
        <MetricCard
          title="TOTAL MEMBERS"
          value={loading ? '...' : (stats?.total_members ?? 0).toLocaleString()}
          icon={Users}
          accentColor="blue"
        />
        <MetricCard
          title="TOTAL SAVINGS"
          value={loading ? '...' : formatCurrency(stats?.total_savings ?? 0)}
          icon={Wallet}
          accentColor="purple"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SACCO Growth Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-800" />
                <h2 className="text-base font-bold text-slate-900">SACCO Registration Growth</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                Cumulative Growth
              </span>
            </div>

            {/* Custom SVG Trend Chart */}
            <div className="relative h-44 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                {/* Area Fill */}
                <path
                  d="M 0,100 Q 100,70 200,85 T 400,30 L 500,20 L 500,120 L 0,120 Z"
                  fill="url(#growthGradient)"
                />
                {/* Line Path */}
                <path
                  d="M 0,100 Q 100,70 200,85 T 400,30 L 500,20"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data Points */}
                <circle cx="100" cy="78" r="4" fill="#10B981" />
                <circle cx="200" cy="85" r="4" fill="#10B981" />
                <circle cx="300" cy="55" r="4" fill="#10B981" />
                <circle cx="400" cy="30" r="4" fill="#10B981" />
                <circle cx="500" cy="20" r="4" fill="#10B981" />
              </svg>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-2 px-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Consistent platform adoption across regions</span>
            <span className="font-bold text-emerald-600">+18% increase this quarter</span>
          </div>
        </div>

        {/* Right Col: SACCO Status Distribution Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-slate-800" />
                <h2 className="text-base font-bold text-slate-900">SACCO Status Breakdown</h2>
              </div>
            </div>

            {/* Visual Ring */}
            <div className="flex items-center justify-center py-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#10B981]"
                    strokeDasharray={`${approvedPct}, 100`}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-slate-900">{stats?.total_saccos ?? 0}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></span>
                  <span className="text-slate-700">Approved</span>
                </div>
                <span className="text-slate-900 font-bold">{stats?.approved_saccos ?? 0} ({approvedPct}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                  <span className="text-slate-700">Pending</span>
                </div>
                <span className="text-slate-900 font-bold">{stats?.pending_saccos ?? 0} ({pendingPct}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                  <span className="text-slate-700">Rejected</span>
                </div>
                <span className="text-slate-900 font-bold">{stats?.rejected_saccos ?? 0} ({rejectedPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending SACCO Approvals Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Pending SACCO Applications
            </h2>
          </div>
          <Link
            to="/super-admin/saccos?status=pending"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            View All Pending
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span>Loading applications...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-rose-500 flex flex-col items-center justify-center gap-2">
              <span>{error}</span>
              <button
                onClick={fetchDashboardData}
                className="mt-1 px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-md transition-colors"
              >
                Retry
              </button>
            </div>
          ) : pendingList.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No pending SACCO applications at this time.
            </div>
          ) : (
            pendingList.map((sacco) => (
              <div
                key={sacco.id}
                className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0 border border-amber-200/60">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <Link
                      to={`/super-admin/saccos/${sacco.id}`}
                      className="text-sm font-bold text-slate-900 leading-snug hover:text-amber-700 transition-colors"
                    >
                      {sacco.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200/60">
                        {sacco.registration_number}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>Submitted {sacco.created_at ? new Date(sacco.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                  <button
                    disabled={actionLoadingId === sacco.id}
                    onClick={() => handleReject(sacco)}
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {actionLoadingId === sacco.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    <span>Reject</span>
                  </button>
                  <button
                    disabled={actionLoadingId === sacco.id}
                    onClick={() => handleApprove(sacco)}
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
                  >
                    {actionLoadingId === sacco.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
