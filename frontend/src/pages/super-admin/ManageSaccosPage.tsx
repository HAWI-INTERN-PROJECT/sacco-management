import React, { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SaccoStatusBadge } from '../../components/super-admin/SaccoStatusBadge'
import { ChevronLeft, ChevronRight, Loader2, RefreshCw, Search } from 'lucide-react'
import { toast } from 'sonner'
import { adminSaccoService } from '../../services/adminSaccoService'
import type { Sacco, PaginationMeta } from '../../types'

export const ManageSaccosPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusParam = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | 'suspended' | null
  const searchParam = searchParams.get('search') || ''

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>(
    statusParam && ['pending', 'approved', 'rejected', 'suspended'].includes(statusParam) ? statusParam : 'all'
  )
  const [searchQuery, setSearchQuery] = useState<string>(searchParam)
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [sortFilter, setSortFilter] = useState<string>('newest')

  const [loading, setLoading] = useState<boolean>(true)
  const [exporting, setExporting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saccosList, setSaccosList] = useState<Sacco[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  // Counts for tabs
  const [tabCounts, setTabCounts] = useState<{
    all?: number
    pending?: number
    approved?: number
    rejected?: number
  }>({})

  // Sync tab with URL search params if updated externally
  useEffect(() => {
    if (statusParam && ['pending', 'approved', 'rejected', 'suspended'].includes(statusParam)) {
      setActiveTab(statusParam)
    } else if (!statusParam) {
      setActiveTab('all')
    }
  }, [statusParam])

  // Fetch SACCOs for current tab, search query & page
  const fetchSaccos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const statusArg = activeTab === 'all' ? undefined : activeTab
      const response = await adminSaccoService.getSaccos({
        status: statusArg,
        search: searchQuery.trim() || undefined,
        region: regionFilter || undefined,
        sort: sortFilter,
        page: currentPage,
      })

      setSaccosList(response.data || [])
      setMeta(response.meta || null)

      // Update current active tab count from metadata if returned
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
  }, [activeTab, searchQuery, regionFilter, sortFilter, currentPage])

  useEffect(() => {
    fetchSaccos()
  }, [fetchSaccos])

  // Fetch overall tab counts once on mount
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
          all: allRes.meta?.total ?? allRes.data?.length,
          pending: pendingRes.meta?.total ?? pendingRes.data?.length,
          approved: approvedRes.meta?.total ?? approvedRes.data?.length,
          rejected: rejectedRes.meta?.total ?? rejectedRes.data?.length,
        })
      } catch {
        // Ignore tab counts error gracefully
      }
    }
    fetchCounts()
  }, [])

  const handleTabChange = (tab: 'all' | 'pending' | 'approved' | 'rejected' | 'suspended') => {
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

  const handleExport = async () => {
    setExporting(true)
    try {
      const statusArg = activeTab === 'all' ? undefined : activeTab
      await adminSaccoService.exportSaccos({
        status: statusArg,
        search: searchQuery.trim() || undefined,
      })
      toast.success('SACCO export report downloaded successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to export SACCO report.'
      toast.error(msg)
    } finally {
      setExporting(false)
    }
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

  const handleReject = async (sacco: Sacco) => {
    setActionLoadingId(sacco.id)
    try {
      await adminSaccoService.rejectSacco(sacco.id)
      toast.error(`${sacco.name} rejected.`)
      fetchSaccos()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject SACCO.'
      toast.error(msg)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSuspend = async (sacco: Sacco) => {
    if (!window.confirm(`Are you sure you want to suspend ${sacco.name}?`)) return
    setActionLoadingId(sacco.id)
    try {
      await adminSaccoService.suspendSacco(sacco.id)
      toast.success(`${sacco.name} has been suspended.`)
      fetchSaccos()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to suspend SACCO.'
      toast.error(msg)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReactivate = async (sacco: Sacco) => {
    if (!window.confirm(`Are you sure you want to reactivate ${sacco.name}?`)) return
    setActionLoadingId(sacco.id)
    try {
      await adminSaccoService.reactivateSacco(sacco.id)
      toast.success(`${sacco.name} has been reactivated.`)
      fetchSaccos()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reactivate SACCO.'
      toast.error(msg)
    } finally {
      setActionLoadingId(null)
    }
  }

  const renderPageNumbers = () => {
    if (!meta || meta.last_page <= 1) return null
    const pages = []
    for (let i = 1; i <= meta.last_page; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors ${
            currentPage === i
              ? 'bg-[#0B1727] text-white'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          {i}
        </button>
      )
    }
    return pages
  }

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage SACCOs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, approve, and manage registered cooperatives across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search SACCOs..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all w-48 sm:w-64"
            />
          </div>
          <button
            onClick={fetchSaccos}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'pending', 'approved', 'rejected', 'suspended'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab} {tabCounts[tab as keyof typeof tabCounts] !== undefined && activeTab === tab ? `(${tabCounts[tab as keyof typeof tabCounts]})` : ''}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none"
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Regions</option>
            <option value="Addis Ababa">Addis Ababa</option>
            <option value="Oromia">Oromia</option>
            <option value="Amhara">Amhara</option>
          </select>
          <select
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none"
            value={sortFilter}
            onChange={(e) => {
              setSortFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="members_desc">Most Members</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#0B1727] text-white text-[11px] uppercase tracking-wider font-bold">
                <th className="py-4 px-6">SACCO Name</th>
                <th className="py-4 px-6">Registration #</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Members</th>
                <th className="py-4 px-6">Registered Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                      <span>Loading SACCOs...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-rose-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span>{error}</span>
                      <button
                        onClick={fetchSaccos}
                        className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-md transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : saccosList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No SACCOs match the selected status.
                  </td>
                </tr>
              ) : (
                saccosList.map((sacco) => (
                  <tr key={sacco.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link
                        to={`/super-admin/saccos/${sacco.id}`}
                        className="hover:text-amber-700 transition-colors"
                      >
                        {sacco.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-600">
                      {sacco.registration_number}
                    </td>
                    <td className="py-4 px-6">
                      <SaccoStatusBadge status={sacco.status} />
                    </td>
                    <td className="py-4 px-6 text-center font-medium">
                      {(sacco.members_count ?? 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {sacco.created_at ? new Date(sacco.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {sacco.status === 'pending' && (
                          <>
                            <button
                              disabled={actionLoadingId === sacco.id}
                              onClick={() => handleApprove(sacco)}
                              className="px-3.5 py-1 bg-[#DCFCE7] hover:bg-emerald-200 text-[#15803D] text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              disabled={actionLoadingId === sacco.id}
                              onClick={() => handleReject(sacco)}
                              className="px-3.5 py-1 bg-[#FEE2E2] hover:bg-rose-200 text-[#B91C1C] text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {sacco.status === 'approved' && (
                           <button
                            disabled={actionLoadingId === sacco.id}
                            onClick={() => handleSuspend(sacco)}
                            className="px-3.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        )}

                        {sacco.status === 'suspended' && (
                           <button
                            disabled={actionLoadingId === sacco.id}
                            onClick={() => handleReactivate(sacco)}
                            className="px-3.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                          >
                            Reactivate
                          </button>
                        )}

                        <Link
                          to={`/super-admin/saccos/${sacco.id}`}
                          className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {meta && meta.total > 0 ? (
              <>Showing {meta.from ?? 1} to {meta.to ?? meta.total} of {meta.total} entries</>
            ) : (
              'Showing 0 entries'
            )}
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!meta || meta.current_page <= 1 || loading}
              className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => setCurrentPage((prev) => (meta ? Math.min(prev + 1, meta.last_page) : prev))}
              disabled={!meta || meta.current_page >= meta.last_page || loading}
              className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


