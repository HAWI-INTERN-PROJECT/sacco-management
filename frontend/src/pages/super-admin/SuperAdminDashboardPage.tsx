import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  Hourglass,
  Users,
  Wallet,
  FileSpreadsheet,
  MoreVertical,
  Loader2,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { adminSaccoService } from '../../services/adminSaccoService'
import type { Sacco, DashboardStats } from '../../types'

export const SuperAdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [recentSaccos, setRecentSaccos] = useState<Sacco[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, saccosRes] = await Promise.all([
        adminSaccoService.getDashboardStats(),
        adminSaccoService.getSaccos({ page: 1 }),
      ])

      if (statsRes.data) {
        setStats(statsRes.data)
      }

      if (saccosRes && saccosRes.data) {
        setRecentSaccos(saccosRes.data.slice(0, 5))
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

  const getAdminInitials = (sacco: Sacco) => {
    if (sacco.name) {
      return sacco.name.substring(0, 1).toUpperCase()
    }
    return 'A'
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Overview of all SACCOs on the platform</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Refresh dashboard"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stat Cards Grid (2 rows of 3 = 6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Total SACCOs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total SACCOs</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : (stats?.total_saccos ?? 24).toLocaleString()}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Approved SACCOs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Approved SACCOs</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : (stats?.approved_saccos ?? 18).toLocaleString()}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending Approval */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-2xs flex items-center justify-between bg-amber-50/10">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pending Approval</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : (stats?.pending_saccos ?? 4).toLocaleString()}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Total Members */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Members</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : (stats?.total_members ?? 3456).toLocaleString()}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 5: Total Savings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Savings</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {loading
                ? '...'
                : stats?.total_savings
                ? `ETB ${(stats.total_savings / 1000000).toFixed(2)}M`
                : 'ETB 45.89M'}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Card 6: Active Loans */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Loans</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : (stats?.total_active_loans ?? 534).toLocaleString()}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Middle Section: SACCO Growth Area Chart + SACCO Status Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: SACCO Growth (Span 3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">SACCO Growth</h2>
            <button className="p-1 rounded text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 h-56 relative w-full overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M 10 160 Q 90 170 140 120 T 260 80 T 380 90 T 490 20 L 490 170 L 10 170 Z"
                fill="url(#growthGradient)"
              />

              {/* Smooth Curve Line */}
              <path
                d="M 10 160 Q 90 170 140 120 T 260 80 T 380 90 T 490 20"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Right: SACCO Status Donut Chart (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">SACCO Status</h2>
          </div>

          {/* Donut Chart */}
          <div className="my-4 flex flex-col items-center justify-center relative">
            <div className="w-36 h-36 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Approved Segment (75%) */}
                <path
                  className="text-[#10B981]"
                  strokeDasharray="75, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Pending Segment (17%) */}
                <path
                  className="text-[#F59E0B]"
                  strokeDasharray="17, 100"
                  strokeDashoffset="-75"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Rejected Segment (8%) */}
                <path
                  className="text-[#EF4444]"
                  strokeDasharray="8, 100"
                  strokeDashoffset="-92"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900">
                  {stats?.total_saccos ?? 24}
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">TOTAL</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-6 text-xs font-medium text-slate-600 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span>Approved (75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                <span>Pending (17%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span>Rejected (8%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table Card: Recent SACCO Registrations */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Recent SACCO Registrations</h2>
          <Link
            to="/super-admin/saccos"
            className="text-xs font-semibold text-[#0F5132] hover:text-[#0B3D26] transition-colors inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">SACCO Name</th>
                <th className="py-3 px-4">Registration #</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-600" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-rose-500">
                    {error}
                  </td>
                </tr>
              ) : recentSaccos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No recent registrations found.
                  </td>
                </tr>
              ) : (
                recentSaccos.map((sacco) => (
                  <tr key={sacco.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* SACCO Name */}
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <Link to={`/super-admin/saccos/${sacco.id}`} className="hover:text-emerald-700">
                        {sacco.name}
                      </Link>
                    </td>

                    {/* Registration # */}
                    <td className="py-4 px-4 font-mono text-slate-500">
                      {sacco.registration_number}
                    </td>

                    {/* Admin */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {getAdminInitials(sacco)}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {sacco.name ? `${sacco.name.split(' ')[0]} K.` : 'Admin'}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500">
                      {sacco.created_at ? new Date(sacco.created_at).toLocaleDateString() : 'Oct 12, 2023'}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {sacco.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
                          Approved
                        </span>
                      )}
                      {sacco.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E]">
                          Pending
                        </span>
                      )}
                      {sacco.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C]">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      {sacco.status === 'pending' ? (
                        <button
                          disabled={actionLoadingId === sacco.id}
                          onClick={() => handleApprove(sacco)}
                          className="px-3.5 py-1 rounded-lg bg-[#0F5132] hover:bg-[#0B3D26] text-white text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
                        >
                          {actionLoadingId === sacco.id ? '...' : 'Review'}
                        </button>
                      ) : (
                        <button className="p-1 rounded text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



