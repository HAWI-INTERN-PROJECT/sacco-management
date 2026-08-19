import React, { useState } from 'react'
import {
  FileText,
  TrendingUp,
  Wallet,
  Users,
  Building2,
  ChevronDown,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export const PlatformReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('This Month')
  const [chartPeriod, setChartPeriod] = useState<'3M' | '6M' | '1Y'>('1Y')

  const handleExportPDF = () => {
    toast.success('Generating and downloading Platform Report PDF...')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive overview of platform performance and metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Time Range Dropdown */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-2xs cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            className="bg-[#0F5132] hover:bg-[#0B3D26] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Savings Volume */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-3 h-3" />
              +12.5%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Total Savings Volume
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">ETB 45.2M</span>
          </div>
        </div>

        {/* Card 2: Total Loans Disbursed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-3 h-3" />
              +8.2%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Total Loans Disbursed
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">ETB 32.8M</span>
          </div>
        </div>

        {/* Card 3: Repayments Collected */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-3 h-3" />
              +4.1%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Repayments Collected
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">ETB 18.5M</span>
          </div>
        </div>

        {/* Card 4: Platform Growth (Members) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-3 h-3" />
              +15.3%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Platform Growth (Members)
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">124,500</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Growth Trends + SACCO Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trends Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Growth Trends</h2>
                <p className="text-xs text-slate-400">Historical platform performance</p>
              </div>

              {/* Time toggles */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setChartPeriod('3M')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartPeriod === '3M' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  3M
                </button>
                <button
                  onClick={() => setChartPeriod('6M')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartPeriod === '6M' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  6M
                </button>
                <button
                  onClick={() => setChartPeriod('1Y')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartPeriod === '1Y' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1Y
                </button>
              </div>
            </div>

            {/* Checkbox Legend */}
            <div className="flex items-center gap-5 mt-4 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Members
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-amber-600 focus:ring-amber-500" />
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  Savings (Vol)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-slate-600 focus:ring-slate-500" />
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                  Loans (Vol)
                </span>
              </label>
            </div>
          </div>

          {/* Line Chart Representation */}
          <div className="mt-6 h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="590" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="60" x2="590" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="100" x2="590" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="140" x2="590" y2="140" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="180" x2="590" y2="180" stroke="#F1F5F9" strokeWidth="1" />

              {/* Y-axis Labels */}
              <text x="10" y="24" className="text-[10px] fill-slate-400 font-semibold">125</text>
              <text x="10" y="64" className="text-[10px] fill-slate-400 font-semibold">120</text>
              <text x="10" y="104" className="text-[10px] fill-slate-400 font-semibold">115</text>
              <text x="10" y="144" className="text-[10px] fill-slate-400 font-semibold">110</text>
              <text x="10" y="184" className="text-[10px] fill-slate-400 font-semibold">100</text>

              {/* Line 1: Members (Green Line) */}
              <path
                d="M 50 180 L 95 170 L 140 145 L 185 125 L 230 110 L 275 90 L 320 75 L 365 55 L 410 40 L 455 30 L 500 20 L 545 18"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Line 2: Savings (Vol) (Amber Line) */}
              <path
                d="M 50 140 L 95 135 L 140 120 L 185 110 L 230 100 L 275 92 L 320 85 L 365 72 L 410 60 L 455 50 L 500 45 L 545 40"
                fill="none"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Line 3: Loans (Vol) (Dashed Slate Line) */}
              <path
                d="M 50 180 L 95 178 L 140 160 L 185 150 L 230 140 L 275 135 L 320 125 L 365 120 L 410 110 L 455 105 L 500 95 L 545 90"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            </svg>

            {/* X-axis Month Labels */}
            <div className="flex items-center justify-between pl-10 pr-2 pt-2 text-[10px] font-semibold text-slate-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* SACCO Distribution Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">SACCO Distribution</h2>
              <p className="text-xs text-slate-400">By Region</p>
            </div>

            <div className="mt-6 space-y-4">
              {/* Region 1: Addis Ababa */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Addis Ababa</span>
                  <span className="text-emerald-700">42%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              {/* Region 2: Oromia */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Oromia</span>
                  <span className="text-emerald-700">28%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              {/* Region 3: Amhara */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Amhara</span>
                  <span className="text-teal-700">15%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* Region 4: Sidama */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Sidama</span>
                  <span className="text-sky-700">10%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              {/* Region 5: Others */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Others</span>
                  <span className="text-slate-600">5%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table Card: SACCO Performance */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">SACCO Performance</h2>
            <p className="text-xs text-slate-400">Detailed comparison across institutions</p>
          </div>
          <Link
            to="/super-admin/saccos"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">SACCO NAME</th>
                <th className="py-3 px-4">MEMBERS</th>
                <th className="py-3 px-4">SAVINGS VOLUME</th>
                <th className="py-3 px-4">LOANS ACTIVE</th>
                <th className="py-3 px-4">REPAYMENT RATE</th>
                <th className="py-3 px-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <span className="font-bold text-slate-900">Awash Cooperative</span>
                </td>
                <td className="py-4 px-4 text-slate-700">12,450</td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900">ETB 4.2M</span>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-700 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-700">ETB 3.1M</td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    94%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                    E
                  </div>
                  <span className="font-bold text-slate-900">Ethio Savings SACCO</span>
                </td>
                <td className="py-4 px-4 text-slate-700">8,320</td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900">ETB 2.8M</span>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-700 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-700">ETB 2.5M</td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                    82%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-xs">
                    U
                  </div>
                  <span className="font-bold text-slate-900">Unity Teachers Coop</span>
                </td>
                <td className="py-4 px-4 text-slate-700">15,100</td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900">ETB 6.1M</span>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-700 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-700">ETB 4.0M</td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    98%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-xs">
                    M
                  </div>
                  <span className="font-bold text-slate-900">Mercato Traders SACCO</span>
                </td>
                <td className="py-4 px-4 text-slate-700">5,400</td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900">ETB 1.9M</span>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-700 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-700">ETB 2.1M</td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                    65%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
