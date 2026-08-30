import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PieChart, Shield, Bell, Pencil, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  changePassword,
  getProfileExtras,
  saveProfileExtras,
  type ProfileExtras,
} from '../../services/memberPortalService'

function initials(name?: string) {
  if (!name) return 'U'
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProfilePage() {
  const { user, getProfile } = useAuthStore()
  const [loadingUser, setLoadingUser] = useState(!user)
  const [extras, setExtras] = useState<ProfileExtras>({})
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileExtras>({})

  const [pwOpen, setPwOpen] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' })

  useEffect(() => {
    if (!user) {
      getProfile()
        .catch(() => undefined)
        .finally(() => setLoadingUser(false))
    } else {
      setLoadingUser(false)
    }
  }, [user, getProfile])

  useEffect(() => {
    const stored = getProfileExtras(user?.id)
    setExtras(stored)
    setForm(stored)
  }, [user?.id])

  const numShares = (user as unknown as { num_shares?: number })?.num_shares ?? 0
  const memberId = user?.id ? `#SAC-${String(user.id).padStart(4, '0')}` : '#SAC-0000'

  const saveExtras = () => {
    saveProfileExtras(user?.id, form)
    setExtras(form)
    setEditing(false)
    toast.success('Personal info updated.')
  }

  const togglePref = (key: keyof NonNullable<ProfileExtras['notification_prefs']>) => {
    const prefs = extras.notification_prefs || {
      sms_transaction_alerts: true,
      email_newsletters: false,
      dividend_deposit_alerts: true,
    }
    const updated = { ...extras, notification_prefs: { ...prefs, [key]: !prefs[key] } }
    setExtras(updated)
    setForm(updated)
    saveProfileExtras(user?.id, updated)
  }

  const submitPasswordChange = async () => {
    if (!pwForm.current_password || !pwForm.password || !pwForm.password_confirmation) {
      toast.error('Please fill in all password fields.')
      return
    }
    if (pwForm.password !== pwForm.password_confirmation) {
      toast.error('New password and confirmation do not match.')
      return
    }
    setPwSaving(true)
    try {
      await changePassword(pwForm)
      toast.success('Password updated successfully.')
      setPwOpen(false)
      setPwForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not update password. Check your current password and try again.'
      toast.error(message)
    } finally {
      setPwSaving(false)
    }
  }

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
      </div>
    )
  }

  const prefs = extras.notification_prefs || {
    sms_transaction_alerts: true,
    email_newsletters: false,
    dividend_deposit_alerts: true,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">My Profile</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">
        Manage your personal information, security settings, and preferences.
      </p>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        {/* Left: identity card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="h-20 bg-gradient-to-r from-emerald-100 to-indigo-100 dark:from-slate-800 dark:to-slate-800" />
          <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#0B6B3A] text-white flex items-center justify-center text-2xl font-semibold ring-4 ring-white dark:ring-slate-900">
              {initials(user?.name)}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-3">{user?.name}</h2>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              Active Member
            </span>
            <p className="text-xs text-slate-400 mt-1">Member ID: {memberId}</p>

            <div className="w-full text-left mt-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Email Address</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Username</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">@{user?.username}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Phone Number</p>
                {editing ? (
                  <Input
                    value={form.phone || ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+251 9xx xxx xxx"
                    className="mt-1 h-9"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {extras.phone || 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Date of Birth</p>
                {editing ? (
                  <Input
                    type="date"
                    value={form.date_of_birth || ''}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    className="mt-1 h-9"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {extras.date_of_birth || 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Physical Address</p>
                {editing ? (
                  <Input
                    value={form.address || ''}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Woreda, City"
                    className="mt-1 h-9"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {extras.address || 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Employment Details</p>
                {editing ? (
                  <Input
                    value={form.employer || ''}
                    onChange={(e) => setForm({ ...form, employer: e.target.value })}
                    placeholder="Role @ Employer"
                    className="mt-1 h-9"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {extras.employer || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {editing ? (
              <div className="flex gap-2 w-full mt-6">
                <Button variant="outline" className="flex-1" onClick={() => { setForm(extras); setEditing(false) }}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-[#0B6B3A] hover:bg-[#095430]" onClick={saveExtras}>
                  Save
                </Button>
              </div>
            ) : (
              <Button className="w-full mt-6 bg-[#0B6B3A] hover:bg-[#095430]" onClick={() => setEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Personal Info
              </Button>
            )}
            <p className="text-[11px] text-slate-400 mt-3">
              Name, email &amp; username are managed by your SACCO administrator. Other fields are saved on this
              device.
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Shareholding */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-[#0B6B3A]" />
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">My Shareholding</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Shares</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {numShares.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4 sm:col-span-2 flex items-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Share value and equity totals are set by your SACCO administrator. Contact them or check your
                  latest Combined Statement for current figures.
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Security */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#0B6B3A]" />
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Account Security</h3>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-200">Password</p>
                  <p className="text-xs text-slate-400">Keep your account secure</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPwOpen((v) => !v)}>
                  Update
                </Button>
              </div>

              {pwOpen && (
                <div className="pt-4 space-y-3">
                  <div>
                    <Label htmlFor="current_password" className="text-xs">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={pwForm.current_password}
                      onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                      className="mt-1 h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-xs">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={pwForm.password}
                      onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
                      className="mt-1 h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password_confirmation" className="text-xs">Confirm New Password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={pwForm.password_confirmation}
                      onChange={(e) => setPwForm({ ...pwForm, password_confirmation: e.target.value })}
                      className="mt-1 h-9"
                    />
                  </div>
                  <Button
                    className="w-full bg-[#0B6B3A] hover:bg-[#095430]"
                    onClick={submitPasswordChange}
                    disabled={pwSaving}
                  >
                    {pwSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Password
                  </Button>
                </div>
              )}
            </div>

            {/* Notification prefs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-[#0B6B3A]" />
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Notifications</h3>
              </div>
              {(
                [
                  ['sms_transaction_alerts', 'SMS Transaction Alerts', 'Get notified for deposits & withdrawals'],
                  ['email_newsletters', 'Email Newsletters', 'Monthly SACCO updates and news'],
                  ['dividend_deposit_alerts', 'Dividend Deposit Alerts', 'Notify me when dividends are credited'],
                ] as const
              ).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{label}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                  <button
                    onClick={() => togglePref(key)}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      prefs[key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        prefs[key] ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
              <p className="text-[11px] text-slate-400 mt-3">Preferences are saved on this device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
