import { useEffect, useMemo, useState } from 'react'
import { PiggyBank, Landmark, Building2, Download, FileDown, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { Button } from '../../components/ui/button'
import {
  fetchMyLoans,
  fetchMySavings,
  addGeneratedStatement,
  getGeneratedStatements,
  type Loan,
  type SavingsSummary,
  type GeneratedStatement,
} from '../../services/memberPortalService'

const PERIOD_OPTIONS = [
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 3 Months', days: 90 },
  { label: 'Last 6 Months', days: 180 },
  { label: 'This Year', days: 365 },
  { label: 'All Time', days: 0 },
]

function withinPeriod(dateStr: string, days: number) {
  if (!days) return true
  const date = new Date(dateStr).getTime()
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return date >= cutoff
}

function refCode(prefix: string) {
  return `#ST-${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

/** Opens a printable window with the given HTML and triggers the browser's print/save-as-PDF dialog. */
function printAsPdf(title: string, bodyHtml: string) {
  const win = window.open('', '_blank', 'width=800,height=1000')
  if (!win) return
  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 32px; }
          h1 { color: #0B6B3A; font-size: 20px; margin-bottom: 4px; }
          p.sub { color: #64748b; margin-top: 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          th { background: #f1f5f9; color: #475569; text-transform: uppercase; letter-spacing: 0.03em; }
        </style>
      </head>
      <body>${bodyHtml}</body>
    </html>
  `)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 300)
}

export default function StatementsPage() {
  const { user } = useAuthStore()
  const [savings, setSavings] = useState<SavingsSummary | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [downloads, setDownloads] = useState<GeneratedStatement[]>([])

  const [savingsPeriod, setSavingsPeriod] = useState(PERIOD_OPTIONS[0].days)
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null)
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [s, l] = await Promise.all([fetchMySavings().catch(() => null), fetchMyLoans().catch(() => [])])
        if (!cancelled) {
          setSavings(s)
          setLoans(l)
          if (l.length > 0) setSelectedLoanId(l[0].id)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    setDownloads(getGeneratedStatements(user?.id))
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const selectedLoan = useMemo(() => loans.find((l) => l.id === selectedLoanId) || null, [loans, selectedLoanId])

  const recordDownload = (statement: GeneratedStatement) => {
    setDownloads(addGeneratedStatement(user?.id, statement))
  }

  const generateSavingsStatement = () => {
    if (!savings) return
    const periodLabel = PERIOD_OPTIONS.find((p) => p.days === savingsPeriod)?.label || 'All Time'
    const txs = savings.transactions.filter((t) => withinPeriod(t.date, savingsPeriod))
    const rows = txs
      .map(
        (t) => `<tr>
          <td>${new Date(t.date).toLocaleDateString()}</td>
          <td>${t.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</td>
          <td>ETB ${t.amount.toLocaleString()}</td>
          <td>ETB ${(t.balance_after ?? 0).toLocaleString()}</td>
          <td>${t.description || '-'}</td>
        </tr>`
      )
      .join('')
    printAsPdf(
      'Savings Statement',
      `<h1>Savings Statement</h1>
       <p class="sub">${user?.name || 'Member'} &middot; ${periodLabel} &middot; Current balance: ETB ${savings.balance.toLocaleString()}</p>
       <table>
         <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th></tr></thead>
         <tbody>${rows || '<tr><td colspan="5">No transactions in this period.</td></tr>'}</tbody>
       </table>`
    )
    recordDownload({
      id: `${Date.now()}`,
      type: 'Savings Statement',
      period: periodLabel,
      reference: refCode('2026-11-A'),
      generated_at: new Date().toISOString(),
    })
  }

  const generateLoanStatement = () => {
    if (!selectedLoan) return
    printAsPdf(
      `Loan Statement - #${selectedLoan.id}`,
      `<h1>Loan Statement</h1>
       <p class="sub">${user?.name || 'Member'} &middot; Loan #${selectedLoan.id} &middot; ${selectedLoan.purpose}</p>
       <table>
         <thead><tr><th>Field</th><th>Value</th></tr></thead>
         <tbody>
           <tr><td>Status</td><td>${selectedLoan.status}</td></tr>
           <tr><td>Principal Amount</td><td>ETB ${selectedLoan.amount.toLocaleString()}</td></tr>
           <tr><td>Interest Rate</td><td>${selectedLoan.interest_rate ?? '-'}%</td></tr>
           <tr><td>Term (months)</td><td>${selectedLoan.term_months ?? '-'}</td></tr>
           <tr><td>Monthly Installment</td><td>${selectedLoan.monthly_installment ? `ETB ${selectedLoan.monthly_installment.toLocaleString()}` : '-'}</td></tr>
           <tr><td>Total Repayable</td><td>${selectedLoan.total_repayable ? `ETB ${selectedLoan.total_repayable.toLocaleString()}` : '-'}</td></tr>
           <tr><td>Disbursed On</td><td>${selectedLoan.disbursed_at ? new Date(selectedLoan.disbursed_at).toLocaleDateString() : '-'}</td></tr>
         </tbody>
       </table>`
    )
    recordDownload({
      id: `${Date.now()}`,
      type: 'Loan Statement',
      period: `Loan #${selectedLoan.id}`,
      reference: refCode(`LN${selectedLoan.id}`),
      generated_at: new Date().toISOString(),
    })
  }

  const generateCombinedStatement = () => {
    const from = rangeFrom ? new Date(rangeFrom) : null
    const to = rangeTo ? new Date(rangeTo) : null
    const inRange = (d: string) => {
      const t = new Date(d).getTime()
      if (from && t < from.getTime()) return false
      if (to && t > to.getTime()) return false
      return true
    }
    const txs = (savings?.transactions || []).filter((t) => inRange(t.date))
    const rows = txs
      .map(
        (t) =>
          `<tr><td>${new Date(t.date).toLocaleDateString()}</td><td>Savings</td><td>${
            t.type
          }</td><td>ETB ${t.amount.toLocaleString()}</td></tr>`
      )
      .concat(
        loans
          .filter((l) => (l.created_at ? inRange(l.created_at) : true))
          .map(
            (l) =>
              `<tr><td>${l.created_at ? new Date(l.created_at).toLocaleDateString() : '-'}</td><td>Loan</td><td>${
                l.status
              }</td><td>ETB ${l.amount.toLocaleString()}</td></tr>`
          )
      )
      .join('')
    printAsPdf(
      'Combined Statement',
      `<h1>Combined Statement</h1>
       <p class="sub">${user?.name || 'Member'} &middot; ${rangeFrom || 'inception'} to ${rangeTo || 'today'}</p>
       <table>
         <thead><tr><th>Date</th><th>Account</th><th>Type</th><th>Amount</th></tr></thead>
         <tbody>${rows || '<tr><td colspan="4">No records in this range.</td></tr>'}</tbody>
       </table>`
    )
    recordDownload({
      id: `${Date.now()}`,
      type: 'Combined Statement',
      period: `${rangeFrom || 'Inception'} - ${rangeTo || 'Today'}`,
      reference: refCode('Q'),
      generated_at: new Date().toISOString(),
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Statements &amp; Reports</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">
        Generate, view, and download your official EthioSACCO financial statements.
      </p>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading your account data...
        </div>
      )}

      {!loading && (
        <div className="grid md:grid-cols-3 gap-5">
          {/* Savings Statement */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
              <PiggyBank className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Savings Statement</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Detailed breakdown of all your deposits, withdrawals, and balance over a selected period.
            </p>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Select Period
            </label>
            <select
              value={savingsPeriod}
              onChange={(e) => setSavingsPeriod(Number(e.target.value))}
              className="w-full mt-1 mb-4 h-10 rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-3 text-sm"
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p.label} value={p.days}>
                  {p.label}
                </option>
              ))}
            </select>
            <Button
              className="w-full bg-[#0B6B3A] hover:bg-[#095430]"
              onClick={generateSavingsStatement}
              disabled={!savings}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>

          {/* Loan Statement */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
              <Landmark className="w-5 h-5 text-indigo-700" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Loan Statement</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Track your loan disbursements, repayment schedule, and outstanding balance.
            </p>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Select Loan
            </label>
            <select
              value={selectedLoanId ?? ''}
              onChange={(e) => setSelectedLoanId(Number(e.target.value))}
              className="w-full mt-1 mb-4 h-10 rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-3 text-sm"
              disabled={loans.length === 0}
            >
              {loans.length === 0 && <option>No loans found</option>}
              {loans.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.purpose || 'Loan'} - #{l.id} ({l.status})
                </option>
              ))}
            </select>
            <Button
              className="w-full bg-slate-900 hover:bg-slate-800"
              onClick={generateLoanStatement}
              disabled={!selectedLoan}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>

          {/* Combined Statement */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5 text-sky-700" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Combined Statement</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Comprehensive report covering your savings and loan accounts for official use.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  From
                </label>
                <input
                  type="date"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  className="w-full mt-1 h-10 rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  To
                </label>
                <input
                  type="date"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  className="w-full mt-1 h-10 rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-2 text-sm"
                />
              </div>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={generateCombinedStatement}>
              <Download className="w-4 h-4 mr-2" />
              Generate &amp; Download
            </Button>
          </div>
        </div>
      )}

      {/* Recent Downloads */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mt-8 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Recent Downloads</h3>
        </div>
        {downloads.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500 dark:text-slate-400 text-center">
            Statements you generate will appear here.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left font-medium px-6 py-3">Statement Type</th>
                <th className="text-left font-medium px-6 py-3">Period</th>
                <th className="text-left font-medium px-6 py-3">Generated Date</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((d) => (
                <tr key={d.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-3">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{d.type}</p>
                    <p className="text-xs text-slate-400">Ref: {d.reference}</p>
                  </td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{d.period}</td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                    {new Date(d.generated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
