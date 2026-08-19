import React, { useState } from 'react'
import { Check, Info, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'

export const PlatformSettingsPage: React.FC = () => {
  // Card 1 state
  const [autoApprove, setAutoApprove] = useState(false)
  const [verifyRegNumber, setVerifyRegNumber] = useState(true)
  const [maxSaccos, setMaxSaccos] = useState('500')

  // Card 2 state
  const [interestRate, setInterestRate] = useState('7.5')
  const [shareValue, setShareValue] = useState('1000')
  const [loanRatio, setLoanRatio] = useState('3:1 (300%)')

  const handleSaveAll = () => {
    toast.success('All platform settings saved successfully.')
  }

  const handleDiscard = () => {
    setAutoApprove(false)
    setVerifyRegNumber(true)
    setMaxSaccos('500')
    setInterestRate('7.5')
    setShareValue('1000')
    setLoanRatio('3:1 (300%)')
    toast.info('Changes discarded.')
  }

  const handleSaveSection1 = () => {
    toast.success('Registration settings updated.')
  }

  const handleSaveSection2 = () => {
    toast.success('Default SACCO parameters updated.')
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage global configurations, branding, and defaults for the entire SACCO ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-full bg-[#0F5132] hover:bg-[#0B3D26] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Save All Changes
          </button>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Registration Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div>
            {/* Title Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Registration Settings</h2>
                <p className="text-xs text-slate-400">Control how new SACCOs join the platform.</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {/* Toggle 1: Auto-Approve Registrations */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-900">Auto-Approve Registrations</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Automatically activate SACCO accounts without manual admin review.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoApprove(!autoApprove)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoApprove ? 'bg-[#10B981]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      autoApprove ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Verify Registration Number */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-900">Verify Registration Number</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Require valid cooperative registration document upload.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setVerifyRegNumber(!verifyRegNumber)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    verifyRegNumber ? 'bg-[#3B82F6]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      verifyRegNumber ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    {verifyRegNumber && <Check className="w-3 h-3 text-[#3B82F6] stroke-[3]" />}
                  </span>
                </button>
              </div>

              {/* Input: Maximum Allowed SACCOs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">Maximum Allowed SACCOs</label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxSaccos}
                    onChange={(e) => setMaxSaccos(e.target.value)}
                    className="w-full pl-4 pr-24 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                    Active Limit
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Platform cap based on current infrastructure tier.</p>
              </div>
            </div>
          </div>

          {/* Card Bottom Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setAutoApprove(false)
                setVerifyRegNumber(true)
                setMaxSaccos('500')
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSaveSection1}
              className="px-5 py-2 rounded-xl bg-[#334155] hover:bg-[#1E293B] text-white text-xs font-bold transition-colors"
            >
              Save Section
            </button>
          </div>
        </div>

        {/* Card 2: Default SACCO Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div>
            {/* Title Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Default SACCO Parameters</h2>
                  <p className="text-xs text-slate-400">Initial financial bounds for new entities.</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                • Defaults Only
              </span>
            </div>

            {/* Info Banner */}
            <div className="mt-5 p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                These settings populate the initial configuration for newly registered SACCOs. Individual SACCO admins
                can modify these later within their own dashboard.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {/* Inputs row: Interest Rate & Share Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 block">Default Interest Rate</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full pl-4 pr-8 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-center"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 block">Default Share Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ETB
                    </span>
                    <input
                      type="text"
                      value={shareValue}
                      onChange={(e) => setShareValue(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Slider: Default Loan-to-Savings Ratio */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Default Loan-to-Savings Ratio</span>
                  <span className="text-emerald-700 font-extrabold">{loanRatio}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative cursor-pointer">
                  <div className="h-full bg-[#10B981] rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>1:1 (Strict)</span>
                  <span>5:1 (Lenient)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Bottom Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setInterestRate('7.5')
                setShareValue('1000')
                setLoanRatio('3:1 (300%)')
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSaveSection2}
              className="px-5 py-2 rounded-xl bg-[#334155] hover:bg-[#1E293B] text-white text-xs font-bold transition-colors"
            >
              Save Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
