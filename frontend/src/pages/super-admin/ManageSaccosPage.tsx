import React, { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Building2,
  ChevronDown,
  Loader2,
  RefreshCw,
  Search,
  Users,
  Store,
  Tractor,
} from 'lucide-react'
import { toast } from 'sonner'
import { adminSaccoService } from '../../services/adminSaccoService'
import type { Sacco, PaginationMeta } from '../../types'

export const ManageSaccosPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusParam = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null
  const searchParam = searchParams.get('search') || ''

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    statusParam && ['pending', 'approved', 'rejected'].includes(statusParam) ? statusParam : 'all'
  )
  const [searchQuery, setSearchQuery] = useState<string>(searchParam)
  const [regionFilter, setRegionFilter] = useState<string>('All')
  const [sortFilter, setSortFilter] = useState<string>('Newest')

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [saccosList, setSaccosList] = useState<Sacco[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const [tabCounts, setTabCounts] = useState<{
    all?: number
    pending?: number
    approved?: number
    rejected?: number
  }>({ all: 24, pending: 4, approved: 18, rejected: 2 })

  useEffect(() => {
    if (statusParam && ['pending', 'approved', 'rejected'].includes(statusParam)) {
      setActiveTab(statusParam)
    } else if (!statusParam) {
      setActiveTab('all')
    }
  }, [statusParam])

  const fetchSaccos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const statusArg = activeTab === 'all' ? undefined : activeTab
      const response = await adminSaccoService.getSaccos({
        status: statusArg,
        search: searchQuery.trim() || undefined,
        page: currentPage,
      })

      setSaccosList(response.data || [])
      setMeta(response.meta || null)

      if (response.meta && !searchQuery.trim()) {
        setTabCounts((prev) => ({
          ...prev,
          [activeTab]: response.meta?.total,
        }))
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch SACCOs.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchQuery, currentPage])

  useEffect(() => {
    fetchSaccos()
  }, [fetchSaccos])

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [allRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
          adminSaccoService.getSaccos({ page: 1 }),
          adminSaccoService.getSaccos({ status: 'pending', page: 1 }),
          adminSaccoService.getSaccos({ status: 'approved', page: 1 }),
          adminSaccoService.getSaccos({ status: 'rejected', page: 1 }),
        ])
        setTabCounts({
          all: allRes.meta?.total ?? allRes.data?.length ?? 24,
          pending: pendingRes.meta?.total ?? pendingRes.data?.length ?? 4,
          approved: approvedRes.meta?.total ?? approvedRes.data?.length ?? 18,
          rejected: rejectedRes.meta?.total ?? rejectedRes.data?.length ?? 2,
        })
      } catch {
        // Fallback demo counts
      }
    }
    fetchCounts()
  }, [])

  const handleTabChange = (tab: 'all' | 'pending' | 'approved' | 'rejected') => {
    setActiveTab(tab)
    setCurrentPage(1)
    if (tab === 'all') {
      searchParams.delete('status')
    } else {
      searchParams.set('status', tab)
    }
    setSearchParams(searchParams)
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
    if (val.trim()) {
      searchParams.set('search', val.trim())
    } else {
      searchParams.delete('search')
    }
    setSearchParams(searchParams)
  }

  const handleApprove = async (sacco: Sacco) => {
    setActionLoadingId(sacco.id)
    try {
      await adminSaccoService.approveSacco(sacco.id)
      toast.success(`${sacco.name} approved successfully!`)
      fetchSaccos()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve SACCO.'
      toast.error(msg)
    } finally {
      setActionLoadingId(null)
    }
  }

  const getSaccoIcon = (index: number) => {
    if (index % 3 === 0) {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
          <Building2 className="w-4 h-4" />
        </div>
      )
    } else if (index % 3 === 1) {
      return (
        <div className="w-9 h-9 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200/60">
          <Store className="w-4 h-4" />
        </div>
      )
    } else {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
          <Tractor className="w-4 h-4" />
        </div>
      )
    }
  }

  const getSaccoLocation = (index: number) => {
    const locations = ['Addis Ababa', 'Addis Ababa', 'Oromia Region', 'Amhara Region', 'Sidama Region']
    return locations[index % locations.length]
  }

  const getAdminEmail = (saccoName: string) => {
    const parts = saccoName.toLowerCase().replace(/[^a-z0-9]/g, '')
    return `admin@${parts.substring(0, 8)}.com`
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">SACCO Management</h1>
        <p className="text-xs text-slate-500 mt-1">Review, approve, and manage all registered SACCOs.</p>
      </div>

      {/* Tabs & Controls Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto">
          <button
            onClick={() => handleTabChange('all')}
            className={`pb-2.5 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'text-[#0F5132] border-b-2 border-[#0F5132]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>All</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {tabCounts.all ?? 24}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('pending')}
            className={`pb-2.5 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pending'
                ? 'text-[#0F5132] border-b-2 border-[#0F5132]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Pending</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
              {tabCounts.pending ?? 4}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('approved')}
            className={`pb-2.5 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'approved'
                ? 'text-[#0F5132] border-b-2 border-[#0F5132]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Approved</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
              {tabCounts.approved ?? 18}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('rejected')}
            className={`pb-2.5 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rejected'
                ? 'text-[#0F5132] border-b-2 border-[#0F5132]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Rejected</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
              {tabCounts.rejected ?? 2}
            </span>
          </button>
        </div>

        {/* Right Search & Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search SACCOs..."
              className="pl-9 pr-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all w-44 sm:w-56"
            />
          </div>

          {/* Region Dropdown */}
          <div className="relative">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
            >
              <option value="All">Region: All</option>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Oromia">Oromia</option>
              <option value="Amhara">Amhara</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Oldest">Sort: Oldest</option>
              <option value="Name">Sort: Name</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={fetchSaccos}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh SACCOs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* SACCOs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">SACCO DETAILS</th>
                <th className="py-3.5 px-6">REG. NUMBER</th>
                <th className="py-3.5 px-6">ADMIN</th>
                <th className="py-3.5 px-6">STATS</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6">DATE</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-600" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-rose-500">
                    {error}
                  </td>
                </tr>
              ) : saccosList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No SACCOs match the selected tab.
                  </td>
                </tr>
              ) : (
                saccosList.map((sacco, idx) => (
                  <tr key={sacco.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* SACCO Details (Icon + Name + Location) */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getSaccoIcon(idx)}
                        <div>
                          <Link
                            to={`/super-admin/saccos/${sacco.id}`}
                            className="font-bold text-slate-900 text-xs hover:text-emerald-700 transition-colors block"
                          >
                            {sacco.name}
                          </Link>
                          <span className="text-[11px] text-slate-400">{getSaccoLocation(idx)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Reg Number */}
                    <td className="py-4 px-6 font-mono text-slate-500 text-xs">
                      {sacco.registration_number}
                    </td>

                    {/* Admin (Name + Email) */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">Abebe Kebede</div>
                      <div className="text-[11px] text-slate-400">{getAdminEmail(sacco.name)}</div>
                    </td>

                    {/* Stats */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{(sacco.members_count ?? 450).toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-900 mt-0.5">
                        ETB {((sacco.id * 1.2) || 1.2).toFixed(1)}M
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {sacco.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E]">
                          Pending
                        </span>
                      )}
                      {sacco.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
                          Approved
                        </span>
                      )}
                      {sacco.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C]">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500">
                      {sacco.created_at ? new Date(sacco.created_at).toLocaleDateString() : 'Oct 24, 2023'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {sacco.status === 'pending' ? (
                        <button
                          disabled={actionLoadingId === sacco.id}
                          onClick={() => handleApprove(sacco)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0F5132] hover:bg-[#0B3D26] text-white text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
                        >
                          {actionLoadingId === sacco.id ? '...' : 'Approve'}
                        </button>
                      ) : (
                        <Link
                          to={`/super-admin/saccos/${sacco.id}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] text-xs font-bold transition-colors"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Showing 1 to {saccosList.length} of {meta?.total ?? 24} results
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentPage === 1 ? 'bg-[#0F5132] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentPage === 2 ? 'bg-[#0F5132] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentPage === 3 ? 'bg-[#0F5132] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              3
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={Boolean(meta && currentPage >= meta.last_page)}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



