import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Download, Eye, Landmark } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { exportToCSV } from '../../utils/exportToCSV'

export const LoansPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(1)

  const { data: loanData, isLoading } = useQuery({
    queryKey: ['adminLoans', activeTab, page],
    queryFn: () => adminService.getLoans(activeTab, page)
  })

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'active', label: 'Active' },
    { id: 'closed', label: 'Closed' },
    { id: 'rejected', label: 'Rejected' }
  ]

  const displayLoans = loanData?.data || []
  const totalCount = loanData?.meta?.total || 0
  const currentPage = loanData?.meta?.current_page || 1
  const lastPage = loanData?.meta?.last_page || 1
  const from = loanData?.meta?.from || 0
  const to = loanData?.meta?.to || 0

  const handleExportLoans = () => {
    if (!displayLoans || displayLoans.length === 0) {
      alert('No loan records currently loaded to export.')
      return
    }

    const columns = [
      { header: 'Loan Number', accessor: (row: any) => row.loan_number || '' },
      { header: 'Member Name', accessor: (row: any) => row.user?.name || row.member?.name || 'Member' },
      { header: 'Principal Amount (ETB)', accessor: (row: any) => Number(row.amount || row.principal_amount || 0) },
      { header: 'Purpose', accessor: (row: any) => row.purpose || '' },
      { header: 'Terms (Months)', accessor: (row: any) => row.term_months || '-' },
      { header: 'Interest Rate (%)', accessor: (row: any) => row.interest_rate || '-' },
      { header: 'Status', accessor: (row: any) => row.status || '' },
      { header: 'Created Date', accessor: (row: any) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '' },
    ]

    exportToCSV('sacco-loans-report.csv', columns, displayLoans)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  }

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Loan Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, disburse, and track member loans.
          </p>
        </div>
        <button 
          onClick={handleExportLoans}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 dark:bg-slate-700 text-white rounded-full text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8 overflow-x-auto px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setPage(1)
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0B6B3A] dark:border-emerald-500 text-[#0B6B3A] dark:text-emerald-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8FAFC] dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Loan #</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Terms</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">Loading loans...</td>
                </tr>
              ) : displayLoans.length > 0 ? (
                displayLoans.map((loan, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <a href="#" className="font-semibold text-[#0B6B3A] dark:text-emerald-400 hover:underline">
                        {loan.loan_number}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {(loan.user?.name || 'Unknown').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{loan.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-normal mr-1">ETB</span>
                        {loan.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 capitalize">{loan.purpose}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 dark:text-white font-medium">{loan.interest_rate || '-'}% interest</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs">{loan.term_months || '-'} months</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${
                        loan.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/50' :
                        loan.status === 'approved' ? 'bg-blue-100 text-blue-700 border border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/50' :
                        loan.status === 'active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/50' :
                        loan.status === 'rejected' ? 'bg-rose-100 text-rose-700 border border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-900/50' :
                        'bg-slate-100 text-slate-600 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {loan.status === 'pending' ? (
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B6B3A] dark:border-emerald-500 text-[#0B6B3A] dark:text-emerald-400 rounded-full text-xs font-semibold hover:bg-[#ECFDF5] dark:hover:bg-emerald-500/10 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Review
                        </button>
                      ) : loan.status === 'approved' ? (
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B6B3A] dark:bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-[#095730] dark:hover:bg-emerald-700 transition-colors">
                          <Landmark className="w-3.5 h-3.5" /> Disburse
                        </button>
                      ) : (
                        <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
                          {loan.status === 'active' ? 'Details' : loan.status === 'closed' ? 'History' : 'Notes'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">No loans found in this category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {from} to {to} of {totalCount} loans
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Prev
            </button>
            <button className="w-8 h-8 rounded bg-[#F1F5F9] dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold border border-slate-200 dark:border-slate-700 transition-colors">
              {currentPage}
            </button>
            <button 
              onClick={() => setPage(p => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
              className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
