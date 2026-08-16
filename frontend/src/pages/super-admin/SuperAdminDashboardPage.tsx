import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  Clock,
  Users,
  Wallet,
  FileText,
  X,
  Check,
} from 'lucide-react'
import { MetricCard } from '../../components/super-admin/MetricCard'
import { toast } from 'sonner'

interface PendingSacco {
  id: string
  name: string
  regNo: string
  dateSubmitted: string
}

export const SuperAdminDashboardPage: React.FC = () => {
  const [pendingList, setPendingList] = useState<PendingSacco[]>([
    {
      id: '1',
      name: 'Unity SACCO',
      regNo: 'REG-2024-001',
      dateSubmitted: 'Submitted Oct 24, 2023',
    },
    {
      id: '2',
      name: 'Forward Credit Union',
      regNo: 'REG-2024-002',
      dateSubmitted: 'Submitted Oct 25, 2023',
    },
    {
      id: '3',
      name: 'Harambee Savings',
      regNo: 'REG-2024-003',
      dateSubmitted: 'Submitted Oct 26, 2023',
    },
    {
      id: '4',
      name: 'Apex Cooperative',
      regNo: 'REG-2024-004',
      dateSubmitted: 'Submitted Oct 27, 2023',
    },
  ])

  const handleApprove = (name: string, id: string) => {
    setPendingList((prev) => prev.filter((item) => item.id !== id))
    toast.success(`${name} has been approved successfully.`)
  }

  const handleReject = (name: string, id: string) => {
    setPendingList((prev) => prev.filter((item) => item.id !== id))
    toast.error(`${name} request has been rejected.`)
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard
          title="TOTAL SACCOS"
          value="28"
          icon={Building2}
          accentColor="black"
        />
        <MetricCard
          title="APPROVED SACCOS"
          value="22"
          icon={CheckCircle2}
          accentColor="green"
        />
        <MetricCard
          title="PENDING APPROVAL"
          value="4"
          icon={Clock}
          accentColor="amber"
          bgHighlight={true}
        />
        <MetricCard
          title="TOTAL MEMBERS"
          value="3,450"
          icon={Users}
          accentColor="blue"
        />
        <MetricCard
          title="TOTAL SAVINGS"
          value="ETB 45,200,000"
          icon={Wallet}
          accentColor="green"
        />
        <MetricCard
          title="TOTAL ACTIVE LOANS"
          value="892"
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
          <Link
            to="/super-admin/saccos"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingList.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No pending approvals at this time.
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
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {sacco.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100/90 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200/60">
                        {sacco.regNo}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{sacco.dateSubmitted}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                  <button
                    onClick={() => handleReject(sacco.name, sacco.id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(sacco.name, sacco.id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
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

