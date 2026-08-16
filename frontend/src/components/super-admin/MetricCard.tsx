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
    black: 'border-l-[4px] border-l-slate-900',
    green: 'border-l-[4px] border-l-emerald-500',
    amber: 'border-l-[4px] border-l-amber-500',
    blue: 'border-l-[4px] border-l-sky-400',
    purple: 'border-l-[4px] border-l-purple-500',
  }

  const iconBgMap = {
    black: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-100/80 text-emerald-600',
    amber: 'bg-amber-100/80 text-amber-600',
    blue: 'bg-sky-100/80 text-sky-500',
    purple: 'bg-purple-100/80 text-purple-600',
  }

  return (
    <div
      className={`rounded-xl border border-slate-200/90 ${borderMap[accentColor]} p-5 shadow-2xs transition-shadow hover:shadow-xs ${
        bgHighlight ? 'bg-[#FFFDF0] border-amber-300/80' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-extrabold tracking-wider uppercase ${
            bgHighlight ? 'text-[#B45309]' : 'text-slate-500'
          }`}
        >
          {title}
        </span>
        <div
          className={`p-2.5 rounded-full flex items-center justify-center shrink-0 ${
            iconBgColor && iconTextColor
              ? `${iconBgColor} ${iconTextColor}`
              : iconBgMap[accentColor]
          }`}
        >
          <Icon className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>
      <div className="mt-2.5">
        <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
          {value}
        </span>
      </div>
    </div>
  )
}

