import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  Clock,
  Users,
  Wallet,
  FileText,
  XCircle,
  X,
  Check,
  Loader2,
  RefreshCw,
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
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard data.'
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
      toast.success(`${sacco.name} has been approved successfully.`)
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
      toast.error(`${sacco.name} application has been rejected.`)
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

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          icon={Clock}
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
          accentColor="green"
        />
        <MetricCard
          title="TOTAL ACTIVE LOANS"
          value={loading ? '...' : (stats?.total_active_loans ?? 0).toLocaleString()}
          icon={FileText}
          accentColor="purple"
        />
      </div>

      {/* Pending SACCO Approvals Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Pending SACCO Approvals
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/super-admin/saccos?status=pending"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span>Loading pending SACCO approvals...</span>
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
              No pending SACCO approvals at this time.
            </div>
          ) : (
            pendingList.map((sacco) => (
              <div
                key={sacco.id}
                className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                {/* Left Info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100/90 rounded-xl flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/60">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <Link
                      to={`/super-admin/saccos/${sacco.id}`}
                      className="text-sm font-bold text-slate-900 leading-snug hover:text-amber-700 transition-colors"
                    >
                      {sacco.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100/90 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200/60">
                        {sacco.registration_number}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>Submitted {sacco.created_at ? new Date(sacco.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                  <button
                    disabled={actionLoadingId === sacco.id}
                    onClick={() => handleReject(sacco)}
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors disabled:opacity-50"
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
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-2xs disabled:opacity-50"
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


