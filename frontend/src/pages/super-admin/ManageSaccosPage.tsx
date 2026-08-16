import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SaccoStatusBadge } from '../../components/super-admin/SaccoStatusBadge'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

interface SaccoItem {
  id: string
  name: string
  regNo: string
  status: 'pending' | 'approved' | 'rejected'
  members: number
  totalSavings: string
  registeredDate: string
}

export const ManageSaccosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const [saccosList, setSaccosList] = useState<SaccoItem[]>([
    {
      id: '1',
      name: 'Unity SACCO',
      regNo: 'REG-2024-001',
      status: 'pending',
      members: 0,
      totalSavings: 'ETB 0',
      registeredDate: 'Oct 24, 2023',
    },
    {
      id: '2',
      name: 'Awash Cooperative',
      regNo: 'REG-2022-045',
      status: 'approved',
      members: 450,
      totalSavings: 'ETB 1.2M',
      registeredDate: 'Jan 15, 2022',
    },
    {
      id: '3',
      name: 'Blue Nile Credit',
      regNo: 'REG-2023-012',
      status: 'rejected',
      members: 0,
      totalSavings: 'ETB 0',
      registeredDate: 'Sep 10, 2023',
    },
    {
      id: '4',
      name: 'Oromia Farmers Union',
      regNo: 'REG-2021-118',
      status: 'approved',
      members: 1205,
      totalSavings: 'ETB 5.4M',
      registeredDate: 'Mar 02, 2021',
    },
    {
      id: '5',
      name: 'Addis Teachers SACCO',
      regNo: 'REG-2024-002',
      status: 'pending',
      members: 0,
      totalSavings: 'ETB 0',
      registeredDate: 'Oct 26, 2023',
    },
    {
      id: '6',
      name: 'Rift Valley Traders',
      regNo: 'REG-2019-033',
      status: 'approved',
      members: 890,
      totalSavings: 'ETB 2.8M',
      registeredDate: 'Nov 11, 2019',
    },
  ])

  const handleApprove = (id: string, name: string) => {
    setSaccosList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    )
    toast.success(`${name} approved successfully!`)
  }

  const handleReject = (id: string, name: string) => {
    setSaccosList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    )
    toast.error(`${name} rejected.`)
  }

  const filteredSaccos = saccosList.filter((item) => {
    if (activeTab === 'all') return true
    return item.status === activeTab
  })

  const counts = {
    all: 28,
    pending: 4,
    approved: 22,
    rejected: 2,
  }

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage SACCOs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, approve, and manage registered cooperatives across the platform.
          </p>
        </div>
        <button
          onClick={() => toast.success('SACCO report exported successfully')}
          className="inline-flex items-center justify-center gap-2 bg-[#0B192C] hover:bg-[#0B192C]/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'all'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({counts.all})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'pending'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Pending ({counts.pending})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'approved'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Approved ({counts.approved})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'rejected'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Rejected ({counts.rejected})
        </button>
      </div>

      {/* Data Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#0B192C] text-white text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6">SACCO Name</th>
                <th className="py-4 px-6">Registration #</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Members</th>
                <th className="py-4 px-6">Total Savings</th>
                <th className="py-4 px-6">Registered Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredSaccos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No SACCOs match the selected status.
                  </td>
                </tr>
              ) : (
                filteredSaccos.map((sacco) => (
                  <tr key={sacco.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link
                        to={`/super-admin/saccos/${sacco.id}`}
                        className="hover:text-amber-600 transition-colors"
                      >
                        {sacco.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-600">
                      {sacco.regNo}
                    </td>
                    <td className="py-4 px-6">
                      <SaccoStatusBadge status={sacco.status} />
                    </td>
                    <td className="py-4 px-6 text-center font-medium">
                      {sacco.members.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {sacco.totalSavings}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {sacco.registeredDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {sacco.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(sacco.id, sacco.name)}
                            className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-md transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(sacco.id, sacco.name)}
                            className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-md transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <Link
                          to={`/super-admin/saccos/${sacco.id}`}
                          className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline"
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

        {/* Table Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>Showing 1 to 6 of 28 entries</div>
          <div className="flex items-center gap-1.5 font-semibold">
            <button
              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded bg-[#0B192C] text-white flex items-center justify-center font-bold">
              1
            </button>
            <button className="w-7 h-7 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-center">
              2
            </button>
            <button className="w-7 h-7 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-center">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="p-1 rounded text-slate-600 hover:text-slate-900">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
