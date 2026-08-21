import React, { useState } from 'react'
import {
  FileText,
  TrendingUp,
  Wallet,
  Users,
  Building2,
  Download,
  ArrowUpRight,
  BarChart2,
  PieChart,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

export const PlatformReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d')

  const topSaccos = [
    {
      name: 'Awash Farmers SACCO',
      region: 'Oromia Region',
      members: 1420,
      savings: 'ETB 14,250,000.00',
      loans: 'ETB 8,100,000.00',
      rating: 'Excellent',
    },
    {
      name: 'Nile Traders SACCO',
      region: 'Addis Ababa',
      members: 980,
      savings: 'ETB 9,800,000.00',
      loans: 'ETB 5,400,000.00',
      rating: 'Excellent',
    },
    {
      name: 'Capital Alliance SACCO',
      region: 'Addis Ababa',
      members: 650,
      savings: 'ETB 6,500,000.00',
      loans: 'ETB 3,200,000.00',
      rating: 'Good',
    },
    {
      name: 'Oromia Micro SACCO',
      region: 'Oromia Region',
      members: 510,
      savings: 'ETB 4,100,000.00',
      loans: 'ETB 2,100,000.00',
      rating: 'Good',
    },
    {
      name: 'Tana Agriculture Cooperative',
      region: 'Amhara Region',
      members: 430,
      savings: 'ETB 3,750,000.00',
      loans: 'ETB 1,850,000.00',
      rating: 'Good',
    },
  ]

  const regionalData = [
    { region: 'Addis Ababa', count: 18, percentage: 42 },
    { region: 'Oromia Region', count: 14, percentage: 32 },
    { region: 'Amhara Region', count: 6, percentage: 14 },
    { region: 'Sidama & SNNPR', count: 5, percentage: 12 },
  ]

  const handleExportReport = () => {
    toast.success(`Platform Summary Report (${timeRange}) downloaded.`)
  }

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated system reports, cross-SACCO financial analytics, and growth metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === '30d' ? 'bg-[#0B1727] text-white' : 'hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === '90d' ? 'bg-[#0B1727] text-white' : 'hover:text-slate-900'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === '1y' ? 'bg-[#0B1727] text-white' : 'hover:text-slate-900'
              }`}
            >
              1 Year
            </button>
          </div>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 bg-[#0B1727] hover:bg-[#0B1727]/90 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Total Platform Savings
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">ETB 38,400,000</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% vs previous period</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Active Loan Portfolio
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">ETB 20,650,000</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.7% vs previous period</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Total Platform Members
            </span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">3,990</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.5% new registrations</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Registered SACCOs
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">43 SACCOs</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
              <span>5 pending approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Growth Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Savings & Loan Portfolio Growth</h2>
              </div>
              <span className="text-xs font-medium text-slate-400">Monthly Volume (ETB)</span>
            </div>

            {/* Custom Visual Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-4 pt-6 pb-2 px-4 bg-slate-50/60 rounded-xl border border-slate-100">
              {[
                { month: 'Jan', savings: 60, loans: 35 },
                { month: 'Feb', savings: 72, loans: 42 },
                { month: 'Mar', savings: 68, loans: 40 },
                { month: 'Apr', savings: 85, loans: 50 },
                { month: 'May', savings: 90, loans: 55 },
                { month: 'Jun', savings: 100, loans: 62 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    <div
                      style={{ height: `${bar.savings}%` }}
                      className="w-full max-w-[20px] bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600"
                      title={`Savings: ${bar.savings}%`}
                    />
                    <div
                      style={{ height: `${bar.loans}%` }}
                      className="w-full max-w-[20px] bg-purple-500 rounded-t-sm transition-all hover:bg-purple-600"
                      title={`Loans: ${bar.loans}%`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-xs"></span>
              <span className="text-slate-600">Savings Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-xs"></span>
              <span className="text-slate-600">Active Loans Volume</span>
            </div>
          </div>
        </div>

        {/* Right Col: Regional Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Regional Distribution</h2>
              </div>
            </div>

            <div className="space-y-4">
              {regionalData.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.region}</span>
                    <span className="text-slate-500">{item.count} SACCOs ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0B1727] h-full rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">
              Expanding coverage across Ethiopia regional states
            </span>
          </div>
        </div>
      </div>

      {/* Top Performing SACCOs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">Top Performing SACCOs</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#0B1727] text-white text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">SACCO Name</th>
                <th className="py-3.5 px-6">Region</th>
                <th className="py-3.5 px-6 text-center">Members</th>
                <th className="py-3.5 px-6">Total Savings</th>
                <th className="py-3.5 px-6">Active Loans</th>
                <th className="py-3.5 px-6 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {topSaccos.map((sacco, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{sacco.name}</td>
                  <td className="py-4 px-6 text-xs text-slate-500">{sacco.region}</td>
                  <td className="py-4 px-6 text-center font-semibold">{sacco.members.toLocaleString()}</td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-emerald-700">
                    {sacco.savings}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-purple-700">
                    {sacco.loans}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {sacco.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
