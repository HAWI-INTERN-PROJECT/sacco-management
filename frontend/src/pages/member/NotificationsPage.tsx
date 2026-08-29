import { useMemo, useState } from 'react'
import { CheckCircle2, CreditCard, Info, TrendingUp, Filter, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useMemberNotifications, type NotificationKind } from '../../hooks/useMemberNotifications'

function timeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const iconFor: Record<NotificationKind, typeof CheckCircle2> = {
  loan: CheckCircle2,
  savings: CreditCard,
  dividend: TrendingUp,
  system: Info,
}

const colorFor: Record<NotificationKind, string> = {
  loan: 'bg-emerald-100 text-emerald-700',
  savings: 'bg-indigo-100 text-indigo-700',
  dividend: 'bg-emerald-100 text-emerald-700',
  system: 'bg-slate-100 text-slate-600',
}

export default function NotificationsPage() {
  const { notifications, loading, error, unreadCount, markAllRead, markOneRead } = useMemberNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [visibleCount, setVisibleCount] = useState(4)

  const visible = useMemo(() => {
    const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications
    return filtered.slice(0, visibleCount)
  }, [notifications, filter, visibleCount])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Stay updated on your account activity and announcements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
          >
            <Filter className="w-4 h-4 mr-2" />
            {filter === 'all' ? 'All' : 'Unread'}
          </Button>
          <Button
            size="sm"
            className="bg-[#0B6B3A] hover:bg-[#095430]"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading notifications...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 p-4 text-sm">{error}</div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
          You're all caught up - no notifications to show.
        </div>
      )}

      <div className="space-y-4">
        {visible.map((n) => {
          const Icon = iconFor[n.kind]
          return (
            <div
              key={n.id}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex gap-4 shadow-sm"
            >
              {!n.read && (
                <span className="absolute left-2 top-6 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorFor[n.kind]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(n.date)}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                {!n.read && (
                  <button
                    onClick={() => markOneRead(n.id)}
                    className="text-sm font-medium text-[#0B6B3A] dark:text-emerald-400 mt-2 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!loading && notifications.length > visible.length && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + 4)}>
            Load Earlier Notifications
          </Button>
        </div>
      )}
    </div>
  )
}