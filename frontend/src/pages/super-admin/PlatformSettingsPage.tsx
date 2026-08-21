import React, { useState } from 'react'
import {
  Shield,
  SlidersHorizontal,
  Save,
  Building2,
} from 'lucide-react'
import { toast } from 'sonner'

export const PlatformSettingsPage: React.FC = () => {
  const [autoApprove, setAutoApprove] = useState<boolean>(false)
  const [allowSelfSignup, setAllowSelfSignup] = useState<boolean>(true)
  const [maxSaccos, setMaxSaccos] = useState<number>(100)
  const [defaultShareCapital, setDefaultShareCapital] = useState<number>(1000)
  const [platformFee, setPlatformFee] = useState<number>(0.5)
  const [enforce2FA, setEnforce2FA] = useState<boolean>(true)
  const [sessionTimeout, setSessionTimeout] = useState<number>(30)
  const [saving, setSaving] = useState<boolean>(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Platform settings saved successfully!')
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure system parameters, SACCO registration policies, and security defaults.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0B1727] hover:bg-[#0B1727]/90 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs disabled:opacity-50 shrink-0"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Registration Policies */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Building2 className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-bold text-slate-900">SACCO Registration & Approval Policy</h2>
              <p className="text-xs text-slate-500">Manage rules for new cooperative onboarding and approval workflows.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
              <div>
                <div className="text-sm font-bold text-slate-900">Auto-Approve SACCO Registrations</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Automatically approve new SACCO submissions without manual Superadmin review.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoApprove(!autoApprove)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoApprove ? 'bg-[#10B981]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    autoApprove ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
              <div>
                <div className="text-sm font-bold text-slate-900">Allow Self-Service Member Signup</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Permit members to register directly on the portal by selecting their respective SACCO.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAllowSelfSignup(!allowSelfSignup)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowSelfSignup ? 'bg-[#10B981]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    allowSelfSignup ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Input Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Maximum SACCO Capacity
                </label>
                <input
                  type="number"
                  value={maxSaccos}
                  onChange={(e) => setMaxSaccos(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Upper limit for active tenant SACCOs on this instance</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Default Minimum Share Capital (ETB)
                </label>
                <input
                  type="number"
                  value={defaultShareCapital}
                  onChange={(e) => setDefaultShareCapital(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default initial share purchase requirement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Financial & Operational Defaults */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <SlidersHorizontal className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Financial Parameters & Fees</h2>
              <p className="text-xs text-slate-500">Default financial settings applied across SACCO tenant accounts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Platform Service Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Percentage fee charged per processed transaction</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                System Default Currency
              </label>
              <input
                type="text"
                disabled
                value="ETB (Ethiopian Birr)"
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Default currency standard across platform</span>
            </div>
          </div>
        </div>

        {/* Card 3: Security Policies */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Shield className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Access Control</h2>
              <p className="text-xs text-slate-500">Configure authentication mandates and session timeouts.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
              <div>
                <div className="text-sm font-bold text-slate-900">Enforce 2FA for Administrators</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Require two-factor authentication for all Superadmin and SACCO Admin accounts.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnforce2FA(!enforce2FA)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enforce2FA ? 'bg-[#10B981]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    enforce2FA ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Session Timeout Duration (Minutes)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="w-full md:w-72 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Inactivity duration before automatic user logout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
