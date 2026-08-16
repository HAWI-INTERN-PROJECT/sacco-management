import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Building2,
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'

export const SaccoDetailsPage: React.FC = () => {
  useParams<{ id: string }>()
  const navigate = useNavigate()
  const [rejectionReason, setRejectionReason] = useState('')
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

  const handleApprove = () => {
    setStatus('approved')
    toast.success('Forward Credit Union has been approved successfully!')
    setTimeout(() => navigate('/super-admin/saccos'), 1200)
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason before rejecting.')
      return
    }
    setStatus('rejected')
    toast.error('Forward Credit Union application rejected.')
    setTimeout(() => navigate('/super-admin/saccos'), 1200)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/super-admin/saccos" className="hover:text-slate-900 transition-colors">
          SACCOs
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">Forward Credit Union</span>
      </nav>

      {/* Page Title & Status Badge */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          SACCO Details
        </h1>
        {status === 'pending' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Approval</span>
          </span>
        )}
        {status === 'approved' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved</span>
          </span>
        )}
        {status === 'rejected' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        )}
      </div>

      {/* Top 2 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Registration Details (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Registration Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">
                SACCO Name
              </span>
              <span className="text-sm font-bold text-slate-900">
                Forward Credit Union
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Registration Number
              </span>
              <span className="text-sm font-mono font-bold text-slate-800">
                REG-2023-88942
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Organization Email
              </span>
              <span className="text-sm font-medium text-slate-800">
                contact@forwardcu.org
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Phone
              </span>
              <span className="text-sm font-medium text-slate-800">
                +251 911 234 567
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Address
              </span>
              <span className="text-sm font-medium text-slate-800">
                Bole Sub-city, Woreda 03, House No. 124, Addis Ababa
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Date Submitted
              </span>
              <span className="text-sm font-medium text-slate-800">
                October 24, 2023
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Administrator Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
              <UserCheck className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">
                Administrator Details
              </h2>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                ET
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Elias Tadesse
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  Primary Admin
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  Admin Email
                </span>
                <span className="text-sm font-medium text-slate-800">
                  elias.t@forwardcu.org
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  Phone Verification
                </span>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Card: Operational Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Operational Preview
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-md">
            Pre-activation state
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50/80 p-4 rounded-lg border-l-4 border-l-slate-900 border border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 block mb-1">
              Member Count
            </span>
            <span className="text-2xl font-extrabold text-slate-900">0</span>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-lg border-l-4 border-l-emerald-500 border border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 block mb-1">
              Total Savings
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              ETB 0.00
            </span>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-lg border-l-4 border-l-amber-500 border border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 block mb-1">
              Active Loans
            </span>
            <span className="text-2xl font-extrabold text-slate-900">0</span>
          </div>
        </div>
      </div>

      {/* Bottom Card: Review Decision */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Review Decision
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="rejectionReason"
              className="text-xs font-bold text-slate-600 block mb-2"
            >
              Rejection Reason (Required if rejecting)
            </label>
            <textarea
              id="rejectionReason"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full p-3.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              onClick={handleReject}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-rose-600 bg-white hover:bg-rose-50 text-rose-600 text-sm font-bold transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject SACCO</span>
            </button>
            <button
              onClick={handleApprove}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve SACCO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
