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
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#854D0E] ${className}`}
        >
          Pending
        </span>
      )
    case 'approved':
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] ${className}`}
        >
          Approved
        </span>
      )
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] ${className}`}
        >
          Rejected
        </span>
      )
    default:
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 ${className}`}
        >
          {status}
        </span>
      )
  }
}

