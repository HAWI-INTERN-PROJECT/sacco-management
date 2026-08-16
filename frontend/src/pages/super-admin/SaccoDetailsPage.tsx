import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { adminSaccoService } from '../../services/adminSaccoService'
import type { Sacco } from '../../types'

export const SaccoDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [sacco, setSacco] = useState<Sacco | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  const fetchSaccoDetails = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const response = await adminSaccoService.getSaccoById(id)
      setSacco(response.data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch SACCO details.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchSaccoDetails()
  }, [fetchSaccoDetails])

  const handleApprove = async () => {
    if (!id || !sacco) return
    setActionLoading(true)
    try {
      const response = await adminSaccoService.approveSacco(id)
      setSacco(response.data || { ...sacco, status: 'approved' })
      toast.success(`${sacco.name} has been approved successfully!`)
      setTimeout(() => navigate('/super-admin/saccos'), 1200)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve SACCO.'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!id || !sacco) return
    setActionLoading(true)
    try {
      const response = await adminSaccoService.rejectSacco(id)
      setSacco(response.data || { ...sacco, status: 'rejected' })
      toast.error(`${sacco.name} application rejected.`)
      setTimeout(() => navigate('/super-admin/saccos'), 1200)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject SACCO.'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-semibold">Loading SACCO details...</span>
        </div>
      </div>
    )
  }

  if (error || !sacco) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-700 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">SACCO Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The requested SACCO could not be found.'}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={fetchSaccoDetails}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Retry
          </button>
          <Link
            to="/super-admin/saccos"
            className="px-4 py-2 bg-[#0B1727] text-white text-xs font-semibold rounded-lg hover:bg-[#0B1727]/90 transition-colors"
          >
            Back to SACCOs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/super-admin/saccos" className="hover:text-slate-900 transition-colors">
          SACCOs
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{sacco.name}</span>
      </nav>

      {/* Page Title & Status Badge */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            SACCO Details
          </h1>
          <button
            onClick={fetchSaccoDetails}
            disabled={loading}
            className="p-1.5 rounded text-slate-400 hover:text-slate-600 transition-colors"
            title="Refresh details"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {sacco.status === 'pending' && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#854D0E] border border-amber-200/60">
            <Clock className="w-3.5 h-3.5 text-[#854D0E]" />
            <span>Pending Approval</span>
          </span>
        )}
        {sacco.status === 'approved' && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Approved</span>
          </span>
        )}
        {sacco.status === 'rejected' && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] border border-rose-200/60">
            <XCircle className="w-3.5 h-3.5 text-[#B91C1C]" />
            <span>Rejected</span>
          </span>
        )}
      </div>

      {/* Top 2 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Registration Details (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Registration Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                SACCO Name
              </span>
              <span className="text-sm font-bold text-slate-900">
                {sacco.name}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                Registration Number
              </span>
              <span className="text-sm font-mono font-bold text-slate-800">
                {sacco.registration_number}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                Organization Email
              </span>
              <span className="text-sm font-medium text-slate-500">
                N/A
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                Phone
              </span>
              <span className="text-sm font-medium text-slate-500">
                N/A
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                Address
              </span>
              <span className="text-sm font-medium text-slate-500">
                N/A
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                Date Submitted
              </span>
              <span className="text-sm font-medium text-slate-800">
                {sacco.created_at ? new Date(sacco.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Administrator Details */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Administrator Details
              </h2>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#0B1727] text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                {sacco.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  Primary Administrator
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  SACCO Admin
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                  Admin Details
                </span>
                <span className="text-sm font-medium text-slate-500">
                  Contact details unavailable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Card: Operational Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
        <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Operational Preview
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-md">
            {sacco.status === 'approved' ? 'Active SACCO' : 'Pre-activation state'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50/70 p-4 rounded-xl border-l-[4px] border-l-slate-900 border border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 block mb-1">
              Member Count
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {(sacco.members_count ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border-l-[4px] border-l-emerald-500 border border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 block mb-1">
              Total Savings
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              N/A
            </span>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border-l-[4px] border-l-amber-500 border border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 block mb-1">
              Active Loans
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              N/A
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Card: Review Decision */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
          Review Decision
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="rejectionReason"
              className="text-xs font-semibold text-slate-600 block mb-2"
            >
              Rejection Reason (Optional Notes)
            </label>
            <textarea
              id="rejectionReason"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter optional notes..."
              className="w-full p-3.5 bg-slate-50/40 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              disabled={actionLoading || sacco.status !== 'pending'}
              onClick={handleReject}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-rose-600 bg-white hover:bg-rose-50 text-rose-600 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 stroke-[2.5]" />}
              <span>Reject SACCO</span>
            </button>
            <button
              disabled={actionLoading || sacco.status !== 'pending'}
              onClick={handleApprove}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-bold transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[2.5]" />}
              <span>Approve SACCO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


