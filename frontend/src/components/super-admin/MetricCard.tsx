import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  accentColor: 'black' | 'green' | 'amber' | 'blue' | 'purple'
  iconBgColor?: string
  iconTextColor?: string
  bgHighlight?: boolean
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  accentColor,
  iconBgColor,
  iconTextColor,
  bgHighlight = false,
}) => {
  const borderMap = {
    black: 'border-l-slate-900',
    green: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    blue: 'border-l-sky-500',
    purple: 'border-l-purple-500',
  }

  const iconBgMap = {
    black: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-sky-50 text-sky-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 border-l-4 ${borderMap[accentColor]} p-5 shadow-xs transition-shadow hover:shadow-sm ${
        bgHighlight ? 'bg-amber-50/40' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
          {title}
        </span>
        <div
          className={`p-2.5 rounded-full ${
            iconBgColor && iconTextColor
              ? `${iconBgColor} ${iconTextColor}`
              : iconBgMap[accentColor]
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
      </div>
    </div>
  )
}
