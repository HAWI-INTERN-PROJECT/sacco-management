import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Search, CheckCircle2, Download, PlusCircle } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import type { LoanSchedule } from '../../types'

export const RepaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('record')
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Fetch active loans for search
  const { data: loansData } = useQuery({
    queryKey: ['adminActiveLoans'],
    queryFn: () => adminService.getLoans('active', 1)
  })

  // Fetch selected loan details
  const { data: selectedLoan } = useQuery({
    queryKey: ['adminLoanDetails', selectedLoanId],
    queryFn: () => selectedLoanId ? adminService.getLoanDetails(selectedLoanId) : null,
    enabled: !!selectedLoanId
  })

  // Fetch overdue stats
  const { data: overdueData } = useQuery({
    queryKey: ['adminOverdueRepayments'],
    queryFn: () => adminService.getOverdueRepayments()
  })

  const activeLoans = loansData?.data || []
  const searchResults = activeLoans.filter(l => 
    l.loan_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.member?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scheduleData: LoanSchedule[] = selectedLoan?.schedules || []
  
  // Calculate progress
  const totalRepayable = selectedLoan?.total_repayable || 0
  const repaidAmount = scheduleData.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount_due, 0)
  const progressPercent = totalRepayable > 0 ? (repaidAmount / totalRepayable) * 100 : 0

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  }

  return (
    <motion.div 
      className="space-y-6 max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Repayments</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage loan installments and track overdue payments.
        </p>
      </div>

      {/* Overdue Alert Banner */}
      {overdueData && overdueData.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 border-dashed rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-rose-500 dark:text-rose-400 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-rose-700 dark:text-rose-400 font-bold text-lg">Attention Required</h3>
              <p className="text-rose-600 dark:text-rose-300 text-sm mt-0.5 font-medium">
                {overdueData.length} overdue installments detected.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('overdue')}
            className="px-5 py-2.5 bg-rose-500 text-white font-semibold text-sm rounded-full shadow-sm hover:bg-rose-600 dark:hover:bg-rose-400 transition-colors whitespace-nowrap"
          >
            View Overdue
          </button>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('record')}
            className={`py-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'record'
                ? 'border-[#0B6B3A] dark:border-emerald-500 text-[#0B6B3A] dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Record Payment
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`py-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overdue'
                ? 'border-[#0B6B3A] dark:border-emerald-500 text-[#0B6B3A] dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Overdue Installments
          </button>
        </nav>
      </div>

      {/* Content Area */}
      {activeTab === 'record' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Select Loan Box */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Select Loan Account</h3>
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by Member ID or Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 focus:border-[#0B6B3A] transition-all"
                />
              </div>

              {isSearchFocused && searchQuery && (
                <div className="absolute z-10 w-full lg:w-[calc(33.333%-1.5rem)] mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map(loan => (
                    <button
                      key={loan.id}
                      onClick={() => {
                        setSelectedLoanId(loan.id)
                        setSearchQuery('')
                        setIsSearchFocused(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex justify-between items-center transition-colors border-b last:border-b-0 border-slate-100 dark:border-slate-700"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{loan.member?.name}</div>
                        <div className="text-xs text-slate-500">{loan.loan_number}</div>
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">ETB {loan.amount}</div>
                    </button>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No active loans found.</div>
                  )}
                </div>
              )}

              {selectedLoanId ? (
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/50 rounded-lg flex flex-col items-start gap-3 relative">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-sm">
                        {selectedLoan?.member?.name?.substring(0, 2).toUpperCase() || 'NA'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedLoan?.member?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Loan ID: {selectedLoan?.loan_number}</div>
                      </div>
                    </div>
                    <div className="text-emerald-500 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  Search to select a loan
                </div>
              )}
            </div>

            {/* Loan Progress Box */}
            {selectedLoanId && (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Loan Progress</h3>
                
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Repaid Amount</div>
                    <div className="text-xl font-extrabold text-[#0B6B3A] dark:text-emerald-400">ETB {repaidAmount.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Total Loan</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">ETB {totalRepayable.toLocaleString()}</div>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#0B6B3A] dark:bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
                  {progressPercent.toFixed(1)}% Completed
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0B6B3A] text-white rounded-lg text-sm font-semibold hover:bg-[#095730] transition-colors shadow-sm">
                  <PlusCircle className="w-4 h-4" />
                  Record New Payment
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Schedule Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Repayment Schedule</h3>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-[#0B6B3A] dark:text-emerald-400 hover:text-[#095730] dark:hover:text-emerald-300 transition-colors">
                <Download className="w-4 h-4" /> Export Schedule
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#F8FAFC] dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Inst.</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Amount (ETB)</th>
                    <th className="px-6 py-4 text-right">Principal</th>
                    <th className="px-6 py-4 text-right">Interest</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {selectedLoanId ? scheduleData.map((row, idx) => (
                    <tr key={idx} className={`
                      transition-colors
                      ${row.status === 'paid' ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                      ${row.status === 'pending' ? 'border-l-2 border-l-blue-500 bg-blue-50/30 dark:bg-blue-500/5' : ''}
                    `}>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.installment_number.toString().padStart(2, '0')}</td>
                      <td className={`px-6 py-4 font-medium ${row.status === 'overdue' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {row.due_date}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${row.status === 'overdue' || row.status === 'pending' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {Number(row.amount_due).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">-</td>
                      <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">-</td>
                      <td className="px-6 py-4 text-center capitalize">
                        {row.status === 'paid' && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Paid
                          </span>
                        )}
                        {row.status === 'overdue' && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-900/50">
                            Overdue
                          </span>
                        )}
                        {row.status === 'pending' && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">Select a loan to view its schedule.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
