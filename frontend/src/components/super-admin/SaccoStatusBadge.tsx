import React from 'react'

export type SaccoStatus = 'pending' | 'approved' | 'rejected' | 'Pending' | 'Approved' | 'Rejected'

interface SaccoStatusBadgeProps {
  status: SaccoStatus
  className?: string
}

export const SaccoStatusBadge: React.FC<SaccoStatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toLowerCase() as 'pending' | 'approved' | 'rejected'

  switch (normalized) {
    case 'pending':
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200/60 ${className}`}>
          Pending
        </span>
      )
    case 'approved':
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200/60 ${className}`}>
          Approved
        </span>
      )
    case 'rejected':
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200/60 ${className}`}>
          Rejected
        </span>
      )
    default:
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}>
          {status}
        </span>
      )
  }
}
